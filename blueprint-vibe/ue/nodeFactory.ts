import { BlueprintNodeData, BPNode, BPEdge } from "../types";
import { getNodeTemplate, NodeCatalogKey } from "./nodeCatalog";

export interface BlueprintNodePlan {
  /** Unique node identifier referenced in edges */
  id: string;
  /** Catalog key defined inside UE_NODE_LIBRARY */
  nodeKey: NodeCatalogKey;
  /** Optional override for the display label */
  labelOverride?: string;
  /** Optional node level comment bubble */
  comment?: string;
  /** Optional map of pin name -> literal value overrides */
  pinValues?: Record<string, string>;
}

export interface BlueprintEdgePlanEndpoint {
  node: string;
  pin: string;
}

export interface BlueprintEdgePlan {
  id?: string;
  source: BlueprintEdgePlanEndpoint;
  target: BlueprintEdgePlanEndpoint;
}

const sanitizePinId = (nodeId: string, rawName: string, existingIds: Set<string>) => {
  const base = `${nodeId}_${rawName.replace(/[^a-zA-Z0-9]/g, "") || "Pin"}`;
  let attempt = base;
  let suffix = 1;
  while (existingIds.has(attempt)) {
    attempt = `${base}_${suffix++}`;
  }
  existingIds.add(attempt);
  return attempt;
};

const createNodeFromTemplate = (plan: BlueprintNodePlan): BPNode => {
  const template = getNodeTemplate(plan.nodeKey);
  const pinIdRegistry = new Set<string>();
  const inputs = template.pins
    .filter((pin) => pin.direction === "input")
    .map((pin) => ({
      id: sanitizePinId(plan.id, pin.name, pinIdRegistry),
      name: pin.name,
      type: pin.type,
      defaultValue: pin.defaultValue,
      value: plan.pinValues?.[pin.name] ?? pin.defaultValue
    }));

  const outputs = template.pins
    .filter((pin) => pin.direction === "output")
    .map((pin) => ({
      id: sanitizePinId(plan.id, pin.name, pinIdRegistry),
      name: pin.name,
      type: pin.type
    }));

  const nodeData: BlueprintNodeData = {
    label: plan.labelOverride || template.label,
    nodeType: template.nodeType,
    inputs,
    outputs,
    comment: plan.comment,
    templateKey: plan.nodeKey,
    pure: template.pure,
    style: template.style,
    description: template.description
  };

  return {
    id: plan.id,
    type: "customBlueprintNode",
    position: { x: 0, y: 0 },
    data: nodeData
  };
};

const resolvePinHandle = (
  node: BPNode,
  pinName: string,
  direction: "input" | "output"
) => {
  const pins =
    direction === "input" ? node.data.inputs : node.data.outputs;
  const pin = pins.find(
    (p) =>
      p.name.toLowerCase() === pinName.toLowerCase() ||
      p.id.toLowerCase() === pinName.toLowerCase()
  );
  if (!pin) {
    throw new Error(
      `Pin "${pinName}" not found on node "${node.id}". Available: ${pins
        .map((p) => p.name)
        .join(", ")}`
    );
  }
  return pin.id;
};

export const instantiateBlueprintPlan = (
  nodePlan: BlueprintNodePlan[] = [],
  edgePlan: BlueprintEdgePlan[] = []
): { nodes: BPNode[]; edges: BPEdge[] } => {
  if (!nodePlan.length) {
    throw new Error("No nodes provided in blueprint plan.");
  }

  const nodes = nodePlan.map(createNodeFromTemplate);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const edges: BPEdge[] = edgePlan.map((edge, index) => {
    const sourceNode = nodeById.get(edge.source.node);
    const targetNode = nodeById.get(edge.target.node);

    if (!sourceNode || !targetNode) {
      throw new Error(
        `Invalid edge linking ${edge.source.node} -> ${edge.target.node}. Ensure both nodes exist.`
      );
    }

    const sourceHandle = resolvePinHandle(
      sourceNode,
      edge.source.pin,
      "output"
    );
    const targetHandle = resolvePinHandle(
      targetNode,
      edge.target.pin,
      "input"
    );

    return {
      id: edge.id || `edge_${index}`,
      source: sourceNode.id,
      target: targetNode.id,
      sourceHandle,
      targetHandle,
      type: "default"
    };
  });

  return { nodes, edges };
};
