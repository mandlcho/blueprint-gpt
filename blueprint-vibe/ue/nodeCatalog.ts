import { NodeType, PinType, UE_COLORS } from "../types";
import GENERATED_NODE_LIBRARY from "./nodeCatalog.generated";

export interface UENodeTemplatePin {
  /** Display name used inside the node body */
  name: string;
  /** Unreal pin data type */
  type: PinType;
  /** Whether the pin renders on the input or output side */
  direction: "input" | "output";
  /** Optional suggested default value when pin is exposed to the UI */
  defaultValue?: string;
}

export interface UENodeTemplate {
  /** Stable identifier referenced by the LLM or translators */
  key: string;
  /** The node title rendered in the header */
  label: string;
  /** Base UE node type (event, function, flow_control, etc.) */
  nodeType: NodeType;
  /** Short human readable description of what the node does */
  description: string;
  /** Whether the node represents a pure (non-exec) function */
  pure?: boolean;
  /** Pin layout definition */
  pins: UENodeTemplatePin[];
  /** Optional color overrides to align with UE styling */
  style?: {
    headerColor?: string;
    borderColor?: string;
  };
}

const NODE_COLORS: Record<NodeType, { header: string; border: string }> = {
  [NodeType.Event]: { header: "#8F0000", border: "#ff6b6b" },
  [NodeType.InputEvent]: { header: "#8F0000", border: "#ff6b6b" },
  [NodeType.FlowControl]: { header: "#505050", border: "#aaaaaa" },
  [NodeType.VariableSet]: { header: UE_COLORS.Default, border: UE_COLORS.Default },
  [NodeType.VariableGet]: { header: "#376F37", border: "#8f8" },
  [NodeType.Macro]: { header: "#505050", border: "#aaaaaa" },
  [NodeType.Function]: { header: "#19457E", border: "#5c9aff" },
};

const enrichTemplate = (template: typeof GENERATED_NODE_LIBRARY[string]): UENodeTemplate => {
  const labelLower = template.label.toLowerCase();
  const descriptionLower = template.description.toLowerCase();

  let resolvedNodeType = template.nodeType;

  const looksLikeEvent =
    labelLower.startsWith("event ") ||
    labelLower.startsWith("on ") ||
    descriptionLower.includes("k2node_event") ||
    descriptionLower.includes("k2node_customevent");

  const looksLikeInputEvent =
    labelLower.includes("input") ||
    descriptionLower.includes("inputaxis") ||
    descriptionLower.includes("inputkey");

  if (looksLikeEvent) {
    resolvedNodeType = NodeType.Event;
  }

  if (looksLikeInputEvent) {
    resolvedNodeType = NodeType.InputEvent;
  }

  const pure =
    resolvedNodeType === NodeType.VariableGet ||
    !template.pins.some((pin) => pin.type === PinType.Exec);
  const baseStyle = NODE_COLORS[resolvedNodeType] ?? NODE_COLORS[NodeType.Function];

  return {
    ...template,
    nodeType: resolvedNodeType,
    pure,
    style: baseStyle,
  };
};

/**
 * Authoritative catalog of UE nodes we guarantee support for.
 */
export const UE_NODE_LIBRARY: Record<string, UENodeTemplate> = Object.fromEntries(
  Object.entries(GENERATED_NODE_LIBRARY).map(([key, template]) => [
    key,
    enrichTemplate(template),
  ])
) as Record<string, UENodeTemplate>;

export type NodeCatalogKey = keyof typeof UE_NODE_LIBRARY;

export const UE_NODE_KEYS = Object.keys(UE_NODE_LIBRARY) as NodeCatalogKey[];

export const getNodeTemplate = (key: NodeCatalogKey): UENodeTemplate => {
  const template = UE_NODE_LIBRARY[key];
  if (!template) {
    throw new Error(`Unknown UE Blueprint node template: ${key}`);
  }
  return template;
};
