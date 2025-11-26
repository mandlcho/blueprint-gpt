import React, { useMemo } from "react";
import { Edge, Node } from "@xyflow/react";
import { BPNode } from "../types";
import { buildUeClipboard } from "../utils/ueBlueprintSerializer";
import "ueblueprint/dist/css/ueb-style.min.css";
import "ueblueprint/dist/ueblueprint.js";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ue-blueprint": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "data-zoom"?: string;
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

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return `ueb-${Math.abs(hash)}`;
};

const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({ nodes, edges }) => {
  const blueprintText = useMemo(
    () => buildUeClipboard(nodes as BPNode[], edges),
    [nodes, edges]
  );

  const blueprintKey = useMemo(() => hashString(blueprintText || "empty"), [blueprintText]);

  if (!blueprintText) {
    return (
      <div className="w-full h-full bg-[#0f0f0f] text-neutral-500 flex items-center justify-center text-xs">
        Blueprint preview unavailable.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#050505]" onContextMenu={(e) => e.preventDefault()}>
      <ue-blueprint
        key={blueprintKey}
        className="ueb-host"
        data-zoom="-3"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          ["--ueb-height" as any]: "100%"
        }}
      >
        <template>{blueprintText}</template>
      </ue-blueprint>
    </div>
  );
};

export default BlueprintCanvas;
