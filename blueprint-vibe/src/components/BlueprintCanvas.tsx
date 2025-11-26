import React, { useEffect, useMemo, useRef } from "react";
import "ueblueprint/dist/css/ueb-style.min.css";
import "ueblueprint/dist/ueblueprint.js";
import type { BlueprintEdge, BlueprintNode } from "../types";
import { buildUeClipboard } from "../utils/ueBlueprintSerializer";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "ueb-blueprint": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        React.RefAttributes<HTMLElement> & {
          "data-zoom"?: string;
        };
    }
  }
}

interface BlueprintCanvasProps {
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

export const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({ nodes, edges }) => {
  const blueprintRef = useRef<HTMLElement | null>(null);
  const clipboard = useMemo(() => buildUeClipboard(nodes, edges), [nodes, edges]);

  useEffect(() => {
    const blueprintEl = blueprintRef.current as any;
    if (!blueprintEl) return;

    let cancelled = false;

    const waitForTemplate = async (retries = 20, delay = 50) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        if (blueprintEl.template?.getPasteInputObject) {
          return blueprintEl.template;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return blueprintEl.template;
    };

    const syncGraph = async () => {
      try {
        if (typeof customElements?.whenDefined === "function") {
          await customElements.whenDefined("ueb-blueprint");
        }

        const templateApi = await waitForTemplate();
        if (!templateApi) {
          console.warn("ueblueprint template not ready yet.");
          return;
        }

        if (blueprintEl.updateComplete instanceof Promise) {
          await blueprintEl.updateComplete;
        }

        if (cancelled) return;

        if (typeof blueprintEl.getNodes === "function" && typeof blueprintEl.removeGraphElement === "function") {
          const existing = (blueprintEl.getNodes() || []).filter(
            (node: Element & { isConnected?: boolean }) => node?.closest?.("ueb-blueprint") === blueprintEl
          );
          if (existing.length) {
            blueprintEl.removeGraphElement(...existing);
          }
        }

        if (!clipboard) return;

        const width = blueprintEl.clientWidth || blueprintEl.offsetWidth || 0;
        const height = blueprintEl.clientHeight || blueprintEl.offsetHeight || 0;
        if (width > 0 && height > 0) {
          blueprintEl.mousePosition = [Math.round(width / 2), Math.round(height / 2)];
        }

        const pasteApi = templateApi.getPasteInputObject?.();
        pasteApi?.pasted(clipboard);
        templateApi.centerContentInViewport?.(false);
      } catch (error) {
        console.error("Failed to sync blueprint preview", error);
      }
    };

    syncGraph();
    return () => {
      cancelled = true;
    };
  }, [clipboard]);

  return (
    <div className="relative w-full h-full bg-[#050505]" onContextMenu={(e) => e.preventDefault()}>
      <ueb-blueprint ref={blueprintRef} data-zoom="-4" style={{ display: "block", width: "100%", height: "100%" }} />
      {!clipboard && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
          Blueprint preview unavailable.
        </div>
      )}
    </div>
  );
};
