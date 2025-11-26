import React, { useEffect, useMemo, useRef } from "react";
import { Edge, Node } from "@xyflow/react";
import { BPNode } from "../types";
import { buildUeClipboard } from "../utils/ueBlueprintSerializer";
import "ueblueprint/dist/css/ueb-style.min.css";
import "ueblueprint/dist/ueblueprint.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ueb-blueprint": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        React.RefAttributes<HTMLElement> & {
          "data-zoom"?: string;
          "data-type"?: string;
        };
    }
  }
}

interface BlueprintCanvasProps {
  nodes: Node[];
  edges: Edge[];
  // Legacy props kept for compatibility with existing App signatures
  onNodesChange?: any;
  onEdgesChange?: any;
  onConnect?: any;
  onReconnect?: any;
  onReconnectStart?: any;
  onReconnectEnd?: any;
  onEdgeClick?: any;
  onNodeClick?: any;
  onPaneClick?: any;
}

type BlueprintElement = HTMLElement & {
  template?: {
    getPasteInputObject?: () => { pasted: (value: string) => void };
    centerContentInViewport?: (smooth?: boolean) => void;
  };
  updateComplete?: Promise<unknown>;
  getNodes?: (selected?: boolean) => any[];
  removeGraphElement?: (...elements: any[]) => void;
  mousePosition?: [number, number];
};

const waitForTemplate = async (element: BlueprintElement, retries = 20, delay = 50) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    if (element.template?.getPasteInputObject) {
      return element.template;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return element.template;
};

const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({ nodes, edges }) => {
  const blueprintRef = useRef<BlueprintElement | null>(null);
  const blueprintText = useMemo(
    () => buildUeClipboard(nodes as BPNode[], edges),
    [nodes, edges]
  );

  useEffect(() => {
    const blueprintEl = blueprintRef.current;
    if (!blueprintEl) return;

    let cancelled = false;

    const syncGraph = async () => {
      try {
        if (typeof customElements?.whenDefined === "function") {
          await customElements.whenDefined("ueb-blueprint");
        }

        if (blueprintEl.updateComplete instanceof Promise) {
          await blueprintEl.updateComplete;
        }

        if (cancelled) return;

        if (
          typeof blueprintEl.getNodes === "function" &&
          typeof blueprintEl.removeGraphElement === "function"
        ) {
          const existing = (blueprintEl.getNodes() || []).filter(
            (node: Element & { isConnected?: boolean }) =>
              node && node.isConnected !== false && node.closest("ueb-blueprint") === blueprintEl
          );
          if (existing.length) {
            blueprintEl.removeGraphElement(...existing);
          }
        }

        if (!blueprintText) return;

        const templateApi = await waitForTemplate(blueprintEl);
        const pasteApi = templateApi?.getPasteInputObject?.();
        if (!pasteApi) {
          console.warn("ueblueprint template not ready yet.");
          return;
        }

        const width = blueprintEl.clientWidth || blueprintEl.offsetWidth || 0;
        const height = blueprintEl.clientHeight || blueprintEl.offsetHeight || 0;
        if (width > 0 && height > 0) {
          blueprintEl.mousePosition = [Math.round(width / 2), Math.round(height / 2)];
        }

        pasteApi.pasted(blueprintText);
        templateApi.centerContentInViewport?.(false);
      } catch (error) {
        console.error("Failed to sync blueprint preview", error);
      }
    };

    syncGraph();

    return () => {
      cancelled = true;
    };
  }, [blueprintText]);

  return (
    <div className="relative w-full h-full bg-[#050505]" onContextMenu={(e) => e.preventDefault()}>
      <ueb-blueprint
        ref={blueprintRef}
        data-zoom="-4"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          ["--ueb-height" as any]: "100%"
        }}
      />
      {!blueprintText && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
          Blueprint preview unavailable.
        </div>
      )}
    </div>
  );
};

export default BlueprintCanvas;
