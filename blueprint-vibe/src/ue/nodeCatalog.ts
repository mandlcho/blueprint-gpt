import { NodeType, PinType } from "../types";
import GENERATED_NODE_LIBRARY, { type GeneratedNodeLibrary } from "./nodeCatalog.generated";

export interface UENodeTemplatePin {
  name: string;
  type: PinType;
  direction: "input" | "output";
  defaultValue?: string;
}

export interface UENodeTemplate {
  key: string;
  label: string;
  nodeType: NodeType;
  description: string;
  pure?: boolean;
  pins: UENodeTemplatePin[];
  style?: {
    headerColor?: string;
    borderColor?: string;
  };
}

const NODE_COLORS: Partial<Record<NodeType, { header: string; border: string }>> = {
  [NodeType.Event]: { header: "#8F0000", border: "#ff6b6b" },
  [NodeType.InputEvent]: { header: "#8F0000", border: "#ff6b6b" },
  [NodeType.FlowControl]: { header: "#505050", border: "#aaaaaa" },
  [NodeType.VariableSet]: { header: "#376F37", border: "#8f8" },
  [NodeType.VariableGet]: { header: "#376F37", border: "#8f8" },
  [NodeType.Macro]: { header: "#505050", border: "#aaaaaa" },
  [NodeType.Function]: { header: "#19457E", border: "#5c9aff" },
};

type GeneratedEntry = GeneratedNodeLibrary[keyof GeneratedNodeLibrary];

const enrichTemplate = (template: GeneratedEntry): UENodeTemplate => {
  const nodeType = template.nodeType as NodeType;
  const pure = nodeType === NodeType.VariableGet || !template.pins.some((pin) => pin.type === PinType.Exec);
  const palette = NODE_COLORS[nodeType] ?? NODE_COLORS[NodeType.Function];
  const pins = template.pins.map((pin) => ({ ...pin }));

  return {
    ...template,
    pins,
    nodeType,
    pure,
    style: palette
      ? {
          headerColor: palette.header,
          borderColor: palette.border,
        }
      : undefined,
  };
};

export const UE_NODE_LIBRARY: Record<string, UENodeTemplate> = Object.fromEntries(
  Object.entries(GENERATED_NODE_LIBRARY).map(([key, template]) => [key, enrichTemplate(template as GeneratedEntry)])
);

export type NodeCatalogKey = keyof typeof UE_NODE_LIBRARY;

export const UE_NODE_KEYS = Object.keys(UE_NODE_LIBRARY) as NodeCatalogKey[];

export const getNodeTemplate = (key: NodeCatalogKey): UENodeTemplate => {
  const template = UE_NODE_LIBRARY[key];
  if (!template) {
    throw new Error(`Unknown UE Blueprint node template: ${key}`);
  }
  return template;
};
