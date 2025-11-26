import { NodeType, PinType } from "../types";

export const GENERATED_NODE_LIBRARY = {
  "!=": {
    key: "!=",
    label: "!=",
    nodeType: NodeType.Function,
    description: "!= (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
    ],
  },
  "&": {
    key: "&",
    label: "&",
    nodeType: NodeType.Function,
    description: "& (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "B",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "&2": {
    key: "&2",
    label: "&",
    nodeType: NodeType.Function,
    description: "& (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "B",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "`": {
    key: "`",
    label: "`",
    nodeType: NodeType.Function,
    description: "` (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "^": {
    key: "^",
    label: "^",
    nodeType: NodeType.Function,
    description: "^ (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "B",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "^2": {
    key: "^2",
    label: "^",
    nodeType: NodeType.Function,
    description: "^ (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "B",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "+": {
    key: "+",
    label: "+",
    nodeType: NodeType.Function,
    description: "+ (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Float,
        direction: "input",
        defaultValue: "123.000000",
      },
      {
        name: "B",
        type: PinType.Float,
        direction: "input",
        defaultValue: "234.000000",
      },
      {
        name: "ReturnValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
      {
        name: "C",
        type: PinType.Float,
        direction: "input",
        defaultValue: "345.000000",
      },
      {
        name: "D",
        type: PinType.Float,
        direction: "input",
        defaultValue: "456.000000",
      },
      {
        name: "E",
        type: PinType.Float,
        direction: "input",
        defaultValue: "567.000000",
      },
    ],
  },
  "<": {
    key: "<",
    label: "<",
    nodeType: NodeType.Function,
    description: "< (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
    ],
  },
  "<=": {
    key: "<=",
    label: "<=",
    nodeType: NodeType.Function,
    description: "<= (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
      {
        name: "ErrorTolerance",
        type: PinType.Struct,
        direction: "input",
      },
    ],
  },
  "==": {
    key: "==",
    label: "==",
    nodeType: NodeType.Function,
    description: "== (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Byte,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Byte,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
      {
        name: "ErrorTolerance",
        type: PinType.Struct,
        direction: "input",
      },
    ],
  },
  "==2": {
    key: "==2",
    label: "==",
    nodeType: NodeType.Function,
    description: "== (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
    ],
  },
  "==3": {
    key: "==3",
    label: "==",
    nodeType: NodeType.Function,
    description: "== (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "LHS",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "RHS",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  ">": {
    key: ">",
    label: ">",
    nodeType: NodeType.Function,
    description: "> (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
    ],
  },
  ">=": {
    key: ">=",
    label: ">=",
    nodeType: NodeType.Function,
    description: ">= (/Script/BlueprintGraph.K2Node_PromotableOperator)",
    pins: [
      {
        name: "A",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "B",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
      },
      {
        name: "ErrorTolerance",
        type: PinType.Struct,
        direction: "input",
      },
    ],
  },
  "|": {
    key: "|",
    label: "|",
    nodeType: NodeType.Function,
    description: "| (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "B",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
      {
        name: "C",
        type: PinType.Integer,
        direction: "input",
      },
      {
        name: "D",
        type: PinType.Integer,
        direction: "input",
      },
      {
        name: "E",
        type: PinType.Integer,
        direction: "input",
      },
    ],
  },
  "|2": {
    key: "|2",
    label: "|",
    nodeType: NodeType.Function,
    description: "| (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "B",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
      {
        name: "C",
        type: PinType.Integer,
        direction: "input",
      },
    ],
  },
  "~": {
    key: "~",
    label: "~",
    nodeType: NodeType.Function,
    description: "~ (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "~2": {
    key: "~2",
    label: "~",
    nodeType: NodeType.Function,
    description: "~ (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "0": {
    key: "0",
    label: "0",
    nodeType: NodeType.Function,
    description: "0 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "1": {
    key: "1",
    label: "1",
    nodeType: NodeType.Function,
    description: "1 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "2": {
    key: "2",
    label: "2",
    nodeType: NodeType.Function,
    description: "2 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "3": {
    key: "3",
    label: "3",
    nodeType: NodeType.Function,
    description: "3 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "4": {
    key: "4",
    label: "4",
    nodeType: NodeType.Function,
    description: "4 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "5": {
    key: "5",
    label: "5",
    nodeType: NodeType.Function,
    description: "5 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "6": {
    key: "6",
    label: "6",
    nodeType: NodeType.Function,
    description: "6 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "7": {
    key: "7",
    label: "7",
    nodeType: NodeType.Function,
    description: "7 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "8": {
    key: "8",
    label: "8",
    nodeType: NodeType.Function,
    description: "8 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "9": {
    key: "9",
    label: "9",
    nodeType: NodeType.Function,
    description: "9 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "A": {
    key: "A",
    label: "A",
    nodeType: NodeType.Function,
    description: "A (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "à": {
    key: "à",
    label: "à",
    nodeType: NodeType.Function,
    description: "à (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "AddLocalNavigationGridForBox": {
    key: "AddLocalNavigationGridForBox",
    label: "Add Local Navigation Grid For Box",
    nodeType: NodeType.Function,
    description: "Add Local Navigation Grid For Box (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Location",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "Extent",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"15.000000",
      },
      {
        name: "Rotation",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"20.000000",
      },
      {
        name: "Radius2D",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "8",
      },
      {
        name: "Height",
        type: PinType.Float,
        direction: "input",
        defaultValue: "200.500000",
      },
      {
        name: "bRebuildGrids",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "ReturnValue",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
    ],
  },
  "AND": {
    key: "AND",
    label: "AND",
    nodeType: NodeType.Function,
    description: "AND (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "B",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "AsyncChangeBundleStateForMatchingPrimaryAssets": {
    key: "AsyncChangeBundleStateForMatchingPrimaryAssets",
    label: "Async Change Bundle State For Matching Primary Assets",
    nodeType: NodeType.Function,
    description: "Async Change Bundle State For Matching Primary Assets (/Script/BlueprintGraph.K2Node_AsyncAction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Completed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "NewBundles",
        type: PinType.Name,
        direction: "input",
      },
      {
        name: "OldBundles",
        type: PinType.Name,
        direction: "input",
      },
    ],
  },
  "BindEventtoModifiedEventDynamic": {
    key: "BindEventtoModifiedEventDynamic",
    label: "Bind Event to Modified Event Dynamic",
    nodeType: NodeType.Function,
    description: "Bind Event to Modified Event Dynamic (/Script/BlueprintGraph.K2Node_AddDelegate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Delegate",
        type: PinType.Delegate,
        direction: "input",
      },
    ],
  },
  "BindEventtoOnActorHit": {
    key: "BindEventtoOnActorHit",
    label: "Bind Event to On Actor Hit",
    nodeType: NodeType.Function,
    description: "Bind Event to On Actor Hit (/Script/BlueprintGraph.K2Node_AddDelegate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Delegate",
        type: PinType.Delegate,
        direction: "input",
      },
    ],
  },
  "BindEventtoOnPreInitialize": {
    key: "BindEventtoOnPreInitialize",
    label: "Bind Event to On Pre Initialize",
    nodeType: NodeType.Function,
    description: "Bind Event to On Pre Initialize (/Script/BlueprintGraph.K2Node_AddDelegate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Delegate",
        type: PinType.Delegate,
        direction: "input",
      },
    ],
  },
  "Branch": {
    key: "Branch",
    label: "Branch",
    nodeType: NodeType.FlowControl,
    description: "Branch (/Script/BlueprintGraph.K2Node_IfThenElse)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Condition",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "else",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "CallASsasdAdsadDD": {
    key: "CallASsasdAdsadDD",
    label: "Call AS!%sasdAdsadDD",
    nodeType: NodeType.Function,
    description: "Call AS!%sasdAdsadDD (/Script/BlueprintGraph.K2Node_CallDelegate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
    ],
  },
  "ConstructionScript": {
    key: "ConstructionScript",
    label: "Construction Script",
    nodeType: NodeType.Function,
    description: "Construction Script (/Script/BlueprintGraph.K2Node_FunctionEntry)",
    pins: [
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "ConvTransformToString": {
    key: "ConvTransformToString",
    label: "Conv Transform To String",
    nodeType: NodeType.Function,
    description: "Conv Transform To String (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "InTrans",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.String,
        direction: "output",
      },
    ],
  },
  "CopyPayload": {
    key: "CopyPayload",
    label: "Copy Payload",
    nodeType: NodeType.Function,
    description: "Copy Payload (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Payload",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ExpectedStruct",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "OutPayload",
        type: PinType.Struct,
        direction: "input",
      },
    ],
  },
  "CreateEvent": {
    key: "CreateEvent",
    label: "Create Event",
    nodeType: NodeType.Function,
    description: "Create Event (/Script/BlueprintGraph.K2Node_CreateDelegate)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
    ],
  },
  "CustomEvent": {
    key: "CustomEvent",
    label: "Custom Event",
    nodeType: NodeType.Function,
    description: "Custom Event (/Script/BlueprintGraph.K2Node_CustomEvent)",
    pins: [
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "CustomEvent2": {
    key: "CustomEvent2",
    label: "Custom Event",
    nodeType: NodeType.Function,
    description: "Custom Event (/Script/BlueprintGraph.K2Node_CustomEvent)",
    pins: [
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "OverlappedComponent",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "OtherActor",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "OtherComp",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "OtherBodyIndex",
        type: PinType.Integer,
        direction: "output",
      },
      {
        name: "bFromSweep",
        type: PinType.Boolean,
        direction: "output",
      },
      {
        name: "SweepResult",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKey": {
    key: "DebugKey",
    label: "Debug Key §",
    nodeType: NodeType.Function,
    description: "Debug Key § (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKey0": {
    key: "DebugKey0",
    label: "Debug Key 0",
    nodeType: NodeType.Function,
    description: "Debug Key 0 (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKey4": {
    key: "DebugKey4",
    label: "Debug Key 4",
    nodeType: NodeType.Function,
    description: "Debug Key 4 (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKeyNum": {
    key: "DebugKeyNum",
    label: "Debug Key Num *",
    nodeType: NodeType.Function,
    description: "Debug Key Num * (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKeyNum5": {
    key: "DebugKeyNum5",
    label: "Debug Key Num 5",
    nodeType: NodeType.Function,
    description: "Debug Key Num 5 (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKeyThumbMouseButton": {
    key: "DebugKeyThumbMouseButton",
    label: "Debug Key Thumb Mouse Button",
    nodeType: NodeType.Function,
    description: "Debug Key Thumb Mouse Button (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "DebugKeyTouch10": {
    key: "DebugKeyTouch10",
    label: "Debug Key Touch 10",
    nodeType: NodeType.Function,
    description: "Debug Key Touch 10 (/Script/InputBlueprintNodes.K2Node_InputDebugKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "ActionValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "Delay": {
    key: "Delay",
    label: "Delay",
    nodeType: NodeType.Function,
    description: "Delay (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Duration",
        type: PinType.Float,
        direction: "input",
        defaultValue: "0.2",
      },
      {
        name: "LatentInfo",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(Linkage=-1",
      },
    ],
  },
  "DoOnce": {
    key: "DoOnce",
    label: "Do Once",
    nodeType: NodeType.Function,
    description: "Do Once (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Reset",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Start Closed",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "Completed",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "è": {
    key: "è",
    label: "è",
    nodeType: NodeType.Function,
    description: "è (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "F1": {
    key: "F1",
    label: "F1",
    nodeType: NodeType.Function,
    description: "F1 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "FlipFlop": {
    key: "FlipFlop",
    label: "Flip Flop",
    nodeType: NodeType.Function,
    description: "Flip Flop (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "Pin",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "B",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "IsA",
        type: PinType.Boolean,
        direction: "output",
      },
    ],
  },
  "ForEachEAudioComponentPlayState": {
    key: "ForEachEAudioComponentPlayState",
    label: "For Each EAudioComponentPlayState",
    nodeType: NodeType.Function,
    description: "For Each EAudioComponentPlayState (/Script/BlueprintGraph.K2Node_ForEachElementInEnum)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "SkipHidden",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "LoopBody",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "EnumValue",
        type: PinType.Byte,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "ForEachLoop": {
    key: "ForEachLoop",
    label: "For Each Loop",
    nodeType: NodeType.Function,
    description: "For Each Loop (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "Exec",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Array",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "LoopBody",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Array Element",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "Array Index",
        type: PinType.Integer,
        direction: "output",
      },
      {
        name: "Completed",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "ForEachLoopwithBreak": {
    key: "ForEachLoopwithBreak",
    label: "For Each Loop with Break",
    nodeType: NodeType.Function,
    description: "For Each Loop with Break (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "Exec",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Array",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "Break",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "LoopBody",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Array Element",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "Array Index",
        type: PinType.Integer,
        direction: "output",
      },
      {
        name: "Completed",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "GetMouseWheelAxis": {
    key: "GetMouseWheelAxis",
    label: "Get Mouse Wheel Axis",
    nodeType: NodeType.Function,
    description: "Get Mouse Wheel Axis (/Script/BlueprintGraph.K2Node_GetInputAxisKeyValue)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "InputAxisKey",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "MouseWheelAxis",
      },
      {
        name: "ReturnValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "GetMouseY": {
    key: "GetMouseY",
    label: "Get Mouse Y",
    nodeType: NodeType.Function,
    description: "Get Mouse Y (/Script/BlueprintGraph.K2Node_GetInputAxisKeyValue)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "InputAxisKey",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "MouseY",
      },
      {
        name: "ReturnValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "GetTouchpadButtonXAxis": {
    key: "GetTouchpadButtonXAxis",
    label: "Get Touchpad Button X Axis",
    nodeType: NodeType.Function,
    description: "Get Touchpad Button X Axis (/Script/BlueprintGraph.K2Node_GetInputAxisKeyValue)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "InputAxisKey",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "Gamepad_Special_Left_X",
      },
      {
        name: "ReturnValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "IsValid": {
    key: "IsValid",
    label: "Is Valid",
    nodeType: NodeType.Function,
    description: "Is Valid (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "exec",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "InputObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Is Valid",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Is Not Valid",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "LeftMouseButton": {
    key: "LeftMouseButton",
    label: "Left Mouse Button",
    nodeType: NodeType.Function,
    description: "Left Mouse Button (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "LineTraceByChannel": {
    key: "LineTraceByChannel",
    label: "Line Trace By Channel",
    nodeType: NodeType.Function,
    description: "Line Trace By Channel (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Start",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "End",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "TraceChannel",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "TraceTypeQuery1",
      },
      {
        name: "bTraceComplex",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "ActorsToIgnore",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "DrawDebugType",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "None",
      },
      {
        name: "OutHit",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "bIgnoreSelf",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "TraceColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=1.000000",
      },
      {
        name: "TraceHitColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=0.000000",
      },
      {
        name: "DrawTime",
        type: PinType.Float,
        direction: "input",
        defaultValue: "5.000000",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "LineTraceByProfile": {
    key: "LineTraceByProfile",
    label: "Line Trace By Profile",
    nodeType: NodeType.Function,
    description: "Line Trace By Profile (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Start",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "End",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "ProfileName",
        type: PinType.Name,
        direction: "input",
        defaultValue: "None",
      },
      {
        name: "bTraceComplex",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "ActorsToIgnore",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "DrawDebugType",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "None",
      },
      {
        name: "OutHit",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "bIgnoreSelf",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "TraceColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=1.000000",
      },
      {
        name: "TraceHitColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=0.000000",
      },
      {
        name: "DrawTime",
        type: PinType.Float,
        direction: "input",
        defaultValue: "5.000000",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "LineTraceForObjects": {
    key: "LineTraceForObjects",
    label: "Line Trace For Objects",
    nodeType: NodeType.Function,
    description: "Line Trace For Objects (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Start",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "End",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "ObjectTypes",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "ObjectTypeQuery1",
      },
      {
        name: "bTraceComplex",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "ActorsToIgnore",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "DrawDebugType",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "ForOneFrame",
      },
      {
        name: "OutHit",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "OutHit_bBlockingHit",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
      {
        name: "OutHit_bInitialOverlap",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
      {
        name: "OutHit_Time",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
      {
        name: "OutHit_Distance",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
      {
        name: "OutHit_Location",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "OutHit_ImpactPoint",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "OutHit_Normal",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "OutHit_ImpactNormal",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "OutHit_PhysMat",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "OutHit_HitActor",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "OutHit_HitComponent",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "OutHit_HitBoneName",
        type: PinType.Name,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "OutHit_BoneName",
        type: PinType.Name,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "OutHit_HitItem",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
      {
        name: "OutHit_ElementIndex",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
      {
        name: "OutHit_FaceIndex",
        type: PinType.Integer,
        direction: "output",
        defaultValue: "0",
      },
      {
        name: "OutHit_TraceStart",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "OutHit_TraceEnd",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "bIgnoreSelf",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "TraceColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=1.000000",
      },
      {
        name: "TraceHitColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=0.000000",
      },
      {
        name: "DrawTime",
        type: PinType.Float,
        direction: "input",
        defaultValue: "5.000000",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "LiteralenumEARLineTraceChannels": {
    key: "LiteralenumEARLineTraceChannels",
    label: "Literal enum EARLineTraceChannels",
    nodeType: NodeType.Function,
    description: "Literal enum EARLineTraceChannels (/Script/BlueprintGraph.K2Node_EnumLiteral)",
    pins: [
      {
        name: "Enum",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "None",
      },
      {
        name: "ReturnValue",
        type: PinType.Byte,
        direction: "output",
      },
    ],
  },
  "MakeSomeAStruct": {
    key: "MakeSomeAStruct",
    label: "Make Some_§-AStruct",
    nodeType: NodeType.Function,
    description: "Make Some_§-AStruct (/Script/BlueprintGraph.K2Node_MakeStruct)",
    pins: [
      {
        name: "Some_§-AStruct",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "FirstVariable_1_13DD7A0E491E619509C7408F7D8C4071",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "False",
      },
      {
        name: "Second-Variable_5_B897B051478F270D20FF29B3BC3B5A8C",
        type: PinType.Struct,
        direction: "input",
      },
    ],
  },
  "MiddleMouseButton": {
    key: "MiddleMouseButton",
    label: "Middle Mouse Button",
    nodeType: NodeType.Function,
    description: "Middle Mouse Button (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "MouseWheelAxis": {
    key: "MouseWheelAxis",
    label: "Mouse Wheel Axis",
    nodeType: NodeType.InputEvent,
    description: "Mouse Wheel Axis (/Script/BlueprintGraph.K2Node_InputAxisKeyEvent)",
    pins: [
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "AxisValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "MouseX": {
    key: "MouseX",
    label: "Mouse X",
    nodeType: NodeType.InputEvent,
    description: "Mouse X (/Script/BlueprintGraph.K2Node_InputAxisKeyEvent)",
    pins: [
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "AxisValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "MouseXY2DAxis": {
    key: "MouseXY2DAxis",
    label: "Mouse XY 2D-Axis",
    nodeType: NodeType.InputEvent,
    description: "Mouse XY 2D-Axis (/Script/BlueprintGraph.K2Node_InputVectorAxisEvent)",
    pins: [
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "AxisValue",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
    ],
  },
  "MouseY": {
    key: "MouseY",
    label: "Mouse Y",
    nodeType: NodeType.InputEvent,
    description: "Mouse Y (/Script/BlueprintGraph.K2Node_InputAxisKeyEvent)",
    pins: [
      {
        name: "OutputDelegate",
        type: PinType.Delegate,
        direction: "output",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "AxisValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "MultiGate": {
    key: "MultiGate",
    label: "Multi Gate",
    nodeType: NodeType.Function,
    description: "Multi Gate (/Script/BlueprintGraph.K2Node_MultiGate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Out 0",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Out 1",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Reset",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "IsRandom",
        type: PinType.Boolean,
        direction: "input",
      },
      {
        name: "Loop",
        type: PinType.Boolean,
        direction: "input",
      },
      {
        name: "StartIndex",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "-1",
      },
    ],
  },
  "NAND": {
    key: "NAND",
    label: "NAND",
    nodeType: NodeType.Function,
    description: "NAND (/Script/BlueprintGraph.K2Node_CommutativeAssociativeBinaryOperator)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "B",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "Num": {
    key: "Num",
    label: "Num /",
    nodeType: NodeType.Function,
    description: "Num / (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Num1": {
    key: "Num1",
    label: "Num 1",
    nodeType: NodeType.Function,
    description: "Num 1 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Num2": {
    key: "Num2",
    label: "Num .",
    nodeType: NodeType.Function,
    description: "Num . (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Num3": {
    key: "Num3",
    label: "Num -",
    nodeType: NodeType.Function,
    description: "Num - (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Num4": {
    key: "Num4",
    label: "Num *",
    nodeType: NodeType.Function,
    description: "Num * (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Num5": {
    key: "Num5",
    label: "Num +",
    nodeType: NodeType.Function,
    description: "Num + (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Num6": {
    key: "Num6",
    label: "Num 6",
    nodeType: NodeType.Function,
    description: "Num 6 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "PrintString": {
    key: "PrintString",
    label: "Print String",
    nodeType: NodeType.Function,
    description: "Print String (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "WorldContextObject",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "InString",
        type: PinType.String,
        direction: "input",
        defaultValue: "Hello",
      },
      {
        name: "bPrintToScreen",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "bPrintToLog",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "TextColor",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"(R=0.000000",
      },
      {
        name: "Duration",
        type: PinType.Float,
        direction: "input",
        defaultValue: "2.000000",
      },
      {
        name: "Key",
        type: PinType.Name,
        direction: "input",
        defaultValue: "None",
      },
    ],
  },
  "ReverseForEachLoop": {
    key: "ReverseForEachLoop",
    label: "Reverse For Each Loop",
    nodeType: NodeType.Function,
    description: "Reverse For Each Loop (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "Exec",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Array",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "LoopBody",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "ArrayIndex",
        type: PinType.Integer,
        direction: "output",
      },
      {
        name: "ArrayElement",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "Completed",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "Self": {
    key: "Self",
    label: "Self",
    nodeType: NodeType.Function,
    description: "Self (/Script/BlueprintGraph.K2Node_Self)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "output",
      },
    ],
  },
  "Sequence": {
    key: "Sequence",
    label: "Sequence",
    nodeType: NodeType.FlowControl,
    description: "Sequence (/Script/BlueprintGraph.K2Node_ExecutionSequence)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then_0",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "then_1",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "then_2",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SIN": {
    key: "SIN",
    label: "SIN",
    nodeType: NodeType.Function,
    description: "SIN (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "A",
        type: PinType.Float,
        direction: "input",
        defaultValue: "0.0",
      },
      {
        name: "ReturnValue",
        type: PinType.Float,
        direction: "output",
        defaultValue: "0.0",
      },
    ],
  },
  "SpawnActorNONE": {
    key: "SpawnActorNONE",
    label: "SpawnActor NONE",
    nodeType: NodeType.Function,
    description: "SpawnActor NONE (/Script/BlueprintGraph.K2Node_SpawnActorFromClass)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Class",
        type: PinType.Class,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "SpawnTransform",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "CollisionHandlingOverride",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "Undefined",
      },
      {
        name: "TransformScaleMethod",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "MultiplyWithRoot",
      },
      {
        name: "Owner",
        type: PinType.Object,
        direction: "input",
      },
    ],
  },
  "SpawnActorPointLight": {
    key: "SpawnActorPointLight",
    label: "SpawnActor Point Light",
    nodeType: NodeType.Function,
    description: "SpawnActor Point Light (/Script/BlueprintGraph.K2Node_SpawnActorFromClass)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Class",
        type: PinType.Class,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Object,
        direction: "output",
      },
      {
        name: "SpawnTransform",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "CollisionHandlingOverride",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "AdjustIfPossibleButDontSpawnIfColliding",
      },
      {
        name: "TransformScaleMethod",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "MultiplyWithRoot",
      },
      {
        name: "Owner",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Instigator",
        type: PinType.Object,
        direction: "input",
        defaultValue: "None",
      },
    ],
  },
  "SteamTouch1": {
    key: "SteamTouch1",
    label: "Steam Touch 1",
    nodeType: NodeType.Function,
    description: "Steam Touch 1 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "SwitchonEConstantQFFTSizeEnum": {
    key: "SwitchonEConstantQFFTSizeEnum",
    label: "Switch on EConstantQFFTSizeEnum",
    nodeType: NodeType.FlowControl,
    description: "Switch on EConstantQFFTSizeEnum (/Script/BlueprintGraph.K2Node_SwitchEnum)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "Min",
      },
      {
        name: "NotEqual_ByteByte",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Min",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "XXSmall",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "XSmall",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Small",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Medium",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Large",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "XLarge",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "XXLarge",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Max",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SwitchonENiagaraOrientationAxis": {
    key: "SwitchonENiagaraOrientationAxis",
    label: "Switch on ENiagaraOrientationAxis",
    nodeType: NodeType.FlowControl,
    description: "Switch on ENiagaraOrientationAxis (/Script/BlueprintGraph.K2Node_SwitchEnum)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "NewEnumerator0",
      },
      {
        name: "NotEqual_ByteByte",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "NewEnumerator0",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "NewEnumerator1",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "NewEnumerator2",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SwitchonFTransformChannelEnum": {
    key: "SwitchonFTransformChannelEnum",
    label: "Switch on FTransformChannelEnum",
    nodeType: NodeType.FlowControl,
    description: "Switch on FTransformChannelEnum (/Script/BlueprintGraph.K2Node_SwitchEnum)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.Byte,
        direction: "input",
        defaultValue: "ScaleX",
      },
      {
        name: "NotEqual_ByteByte",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "TranslateX",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "TranslateY",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "TranslateZ",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "RotateX",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "RotateY",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "RotateZ",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "ScaleX",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "ScaleY",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "ScaleZ",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SwitchonGameplayTag": {
    key: "SwitchonGameplayTag",
    label: "Switch on Gameplay Tag",
    nodeType: NodeType.FlowControl,
    description: "Switch on Gameplay Tag (/Script/GameplayTagsEditor.GameplayTagsK2Node_SwitchGameplayTag)",
    pins: [
      {
        name: "Default",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "NotEqual_TagTag",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Case_0",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_1",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_2",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_3",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_4",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_5",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_6",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_7",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_8",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_9",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_10",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_11",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_12",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_13",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_14",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SwitchonInt": {
    key: "SwitchonInt",
    label: "Switch on Int",
    nodeType: NodeType.FlowControl,
    description: "Switch on Int (/Script/BlueprintGraph.K2Node_SwitchInteger)",
    pins: [
      {
        name: "Default",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.Integer,
        direction: "input",
        defaultValue: "0",
      },
      {
        name: "NotEqual_IntInt",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "0",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "1",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "2",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "3",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "4",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "5",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "6",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "7",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "8",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "9",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "10",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "11",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "12",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "13",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "14",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "15",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "16",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "17",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SwitchonName": {
    key: "SwitchonName",
    label: "Switch on Name",
    nodeType: NodeType.FlowControl,
    description: "Switch on Name (/Script/BlueprintGraph.K2Node_SwitchName)",
    pins: [
      {
        name: "Default",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.Name,
        direction: "input",
        defaultValue: "None",
      },
      {
        name: "NotEqual_NameName",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Case_0",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "SwitchonString": {
    key: "SwitchonString",
    label: "Switch on String",
    nodeType: NodeType.FlowControl,
    description: "Switch on String (/Script/BlueprintGraph.K2Node_SwitchString)",
    pins: [
      {
        name: "Default",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Selection",
        type: PinType.String,
        direction: "input",
      },
      {
        name: "NotEqual_StriStri",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Case_0",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_1",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Case_2",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
  "TargetisActor": {
    key: "TargetisActor",
    label: "Target is Actor",
    nodeType: NodeType.Function,
    description: "Target is Actor (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Struct,
        direction: "output",
      },
    ],
  },
  "TargetisBTTaskBlueprintBase": {
    key: "TargetisBTTaskBlueprintBase",
    label: "Target is BTTask Blueprint Base",
    nodeType: NodeType.Function,
    description: "Target is BTTask Blueprint Base (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "MessageName",
        type: PinType.Name,
        direction: "input",
        defaultValue: "None",
      },
    ],
  },
  "TargetisCharacter": {
    key: "TargetisCharacter",
    label: "Target is Character",
    nodeType: NodeType.Function,
    description: "Target is Character (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "TargetisGameplayTagAssetInterface": {
    key: "TargetisGameplayTagAssetInterface",
    label: "Target is Gameplay Tag Asset Interface",
    nodeType: NodeType.Function,
    description: "Target is Gameplay Tag Asset Interface (/Script/BlueprintGraph.K2Node_Message)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "TagToCheck",
        type: PinType.Struct,
        direction: "input",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "TargetisPrimitiveComponent": {
    key: "TargetisPrimitiveComponent",
    label: "Target is Primitive Component",
    nodeType: NodeType.Function,
    description: "Target is Primitive Component (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "TraceStart",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "TraceEnd",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "bTraceComplex",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "true",
      },
      {
        name: "bShowTrace",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "bPersistentShowTrace",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "HitLocation",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "HitNormal",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "\"0",
      },
      {
        name: "BoneName",
        type: PinType.Name,
        direction: "output",
        defaultValue: "None",
      },
      {
        name: "OutHit",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "ReturnValue",
        type: PinType.Boolean,
        direction: "output",
        defaultValue: "false",
      },
    ],
  },
  "TargetisSceneComponent": {
    key: "TargetisSceneComponent",
    label: "Target is Scene Component",
    nodeType: NodeType.Function,
    description: "Target is Scene Component (/Script/BlueprintGraph.K2Node_CallFunction)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "NewRotation",
        type: PinType.Struct,
        direction: "input",
        defaultValue: "\"0",
      },
      {
        name: "NewRotation_Roll",
        type: PinType.Float,
        direction: "input",
        defaultValue: "0.0",
      },
      {
        name: "NewRotation_Pitch",
        type: PinType.Float,
        direction: "input",
        defaultValue: "0.0",
      },
      {
        name: "NewRotation_Yaw",
        type: PinType.Float,
        direction: "input",
        defaultValue: "0.0",
      },
      {
        name: "bSweep",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
      {
        name: "SweepHitResult",
        type: PinType.Struct,
        direction: "output",
      },
      {
        name: "bTeleport",
        type: PinType.Boolean,
        direction: "input",
        defaultValue: "false",
      },
    ],
  },
  "ThumbMouseButton2": {
    key: "ThumbMouseButton2",
    label: "Thumb Mouse Button 2",
    nodeType: NodeType.Function,
    description: "Thumb Mouse Button 2 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "Timeline": {
    key: "Timeline",
    label: "Timeline",
    nodeType: NodeType.Function,
    description: "Timeline (/Script/BlueprintGraph.K2Node_Timeline)",
    pins: [
      {
        name: "Play",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "PlayFromStart",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Stop",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Reverse",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "ReverseFromEnd",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Update",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Finished",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "SetNewTime",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "NewTime",
        type: PinType.Float,
        direction: "input",
        defaultValue: "0.0",
      },
      {
        name: "Direction",
        type: PinType.Byte,
        direction: "output",
      },
    ],
  },
  "Touch1": {
    key: "Touch1",
    label: "Touch 1",
    nodeType: NodeType.Function,
    description: "Touch 1 (/Script/BlueprintGraph.K2Node_InputKey)",
    pins: [
      {
        name: "Pressed",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Released",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Key",
        type: PinType.Struct,
        direction: "output",
        defaultValue: "None",
      },
    ],
  },
  "UnbindallEventsfromOnScrollBarVisibilityChanged": {
    key: "UnbindallEventsfromOnScrollBarVisibilityChanged",
    label: "Unbind all Events from On Scroll Bar Visibility Changed",
    nodeType: NodeType.Function,
    description: "Unbind all Events from On Scroll Bar Visibility Changed (/Script/BlueprintGraph.K2Node_ClearDelegate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
    ],
  },
  "UnbindEventfromOnPreInitialize": {
    key: "UnbindEventfromOnPreInitialize",
    label: "Unbind Event from On Pre Initialize",
    nodeType: NodeType.Function,
    description: "Unbind Event from On Pre Initialize (/Script/BlueprintGraph.K2Node_RemoveDelegate)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "then",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "self",
        type: PinType.Object,
        direction: "input",
      },
      {
        name: "Delegate",
        type: PinType.Delegate,
        direction: "input",
      },
    ],
  },
  "WhileLoop": {
    key: "WhileLoop",
    label: "While Loop",
    nodeType: NodeType.Function,
    description: "While Loop (/Script/BlueprintGraph.K2Node_MacroInstance)",
    pins: [
      {
        name: "execute",
        type: PinType.Exec,
        direction: "input",
      },
      {
        name: "Condition",
        type: PinType.Boolean,
        direction: "input",
      },
      {
        name: "LoopBody",
        type: PinType.Exec,
        direction: "output",
      },
      {
        name: "Completed",
        type: PinType.Exec,
        direction: "output",
      },
    ],
  },
} as const;

export type GeneratedNodeLibrary = typeof GENERATED_NODE_LIBRARY;
export default GENERATED_NODE_LIBRARY;