export enum PinType {
  Exec = "exec",
  Boolean = "boolean",
  Integer = "integer",
  Float = "float",
  String = "string",
  Vector = "vector",
  Rotator = "rotator",
  Object = "object",
  Class = "class",
  Struct = "struct",
  Byte = "byte",
  Name = "name",
  Text = "text",
  Delegate = "delegate",
}

export const UE_COLORS = {
  Exec: "#FFFFFF",
  Boolean: "#8C0000",
  BooleanConnected: "#920101",
  Integer: "#00E5CA",
  Float: "#35D039",
  String: "#E900EB",
  Vector: "#FDC31F",
  Rotator: "#9999FF",
  Object: "#00A8F6",
  Class: "#5800A5",
  Struct: "#005090",
  Byte: "#006575",
  Name: "#C671FF",
  Text: "#E27294",
  Delegate: "#FF3838",
  Default: "#9ca3af",
};

export enum NodeType {
  Event = "event",
  InputEvent = "input_event",
  Function = "function",
  Macro = "macro",
  VariableGet = "variable_get",
  VariableSet = "variable_set",
  FlowControl = "flow_control",
}

export interface PinDefinition {
  id: string;
  name: string;
  type: PinType;
  defaultValue?: string;
  value?: string;
}

export interface BlueprintNodeData {
  label: string;
  nodeType: NodeType;
  inputs: PinDefinition[];
  outputs: PinDefinition[];
  comment?: string;
  templateKey?: string;
  pure?: boolean;
  description?: string;
  style?: {
    headerColor?: string;
    borderColor?: string;
  };
}

export interface BlueprintNode {
  id: string;
  data: BlueprintNodeData;
  position?: { x: number; y: number };
}

export interface BlueprintEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
