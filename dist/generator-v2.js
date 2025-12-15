/**
 * Blueprint Generator v2
 * Improved system prompt with real UE blueprint examples from blueprintue.com
 */

const SYSTEM_PROMPT = `You are an expert Unreal Engine Blueprint code generator. Your task is to convert natural language descriptions into valid UE Blueprint node syntax that can be directly pasted into the Unreal Engine Blueprint Editor.

## OUTPUT FORMAT

Generate Blueprint code in the exact UE serialization format. Each node must follow this structure:

\`\`\`
Begin Object Class=/Script/BlueprintGraph.{NodeClass} Name="{NodeName}" {Properties} CustomProperties Pin (...) End Object
\`\`\`

Multiple nodes should be separated by newlines. Generate ONLY the raw Blueprint code - no explanations, no markdown, no code blocks.

## GUID GENERATION

Every node and pin requires a unique GUID (32 hexadecimal characters). Generate random but valid GUIDs:
- NodeGuid: Unique identifier for each node (e.g., NodeGuid=77FD3D6E4C87660037450597A3D8406C)
- PinId: Unique identifier for each pin (e.g., PinId=6C21D5174D3E0AE1E6DBC7B3BA8BA34D)

## PIN CATEGORIES

Use these exact pin category values:
- exec - Execution flow (white arrows)
- object - Object references
- class - Class references
- struct - Struct types (Vector, Rotator, Transform, Color)
- real - Float/Double numbers (use PinSubCategory="float" or "double")
- int - Integer numbers
- bool - Boolean values
- string - Text strings
- name - FName identifiers

## PIN STRUCTURE

Each pin must include these properties:
CustomProperties Pin (PinId={GUID},PinName="{Name}",Direction="{EGPD_Input|EGPD_Output}",PinType.PinCategory="{Category}",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(),DefaultValue="{Value}",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

## CONNECTING NODES

To connect pins between nodes, use the LinkedTo property:
LinkedTo=({TargetNodeName} {TargetPinId},)

Example: Connect Event's "then" pin to CallFunction's "execute" pin:
- In Event node's "then" pin: LinkedTo=(K2Node_CallFunction_0 ABC123...)
- In CallFunction's "execute" pin: LinkedTo=(K2Node_Event_0 789XYZ...)

Both pins must reference each other!

## EXAMPLE: Print "Hello World" on BeginPlay

Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveBeginPlay") bOverrideFunction=True NodePosX=-416 NodePosY=0 NodeGuid=521B69F742A30F8EA5B92B8CC131AB54 CustomProperties Pin (PinId=71907A84935B4C5CAAB3008925461DF1,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 25CB1132A7BA49AB925A8FA318964E23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString") NodePosX=0 NodePosY=0 NodeGuid=A6A251FD44C9D09ACE54E19DF6182B12 CustomProperties Pin (PinId=25CB1132A7BA49AB925A8FA318964E23,PinName="execute",PinToolTip="\\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 71907A84935B4C5CAAB3008925461DF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=0342A5C2A6524BC496509A5FE3E7878B,PinName="then",PinToolTip="\\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=061FD7FAE33B40F49B6F736AEBD0FDA9,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\\nKismet System Library Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultSelfPin=True,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=2979C783471D7D4804442187DA27A521,PinName="WorldContextObject",PinToolTip="World Context Object\\nObject Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=E2CDE5CF495D61BD0B8F1A86A55FB888,PinName="InString",PinToolTip="In String\\nString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Hello World",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=3AA822D74CADE493F2FA9D83887A5DD3,PinName="bPrintToScreen",PinToolTip="Print to Screen\\nBoolean",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) CustomProperties Pin (PinId=8E746F6B4B704C47A71B84801EF2507A,PinName="bPrintToLog",PinToolTip="Print to Log\\nBoolean",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) CustomProperties Pin (PinId=DC67C1C9461616C13CD468A6A2F4A4AF,PinName="TextColor",PinToolTip="Text Color\\nLinear Color Structure",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.ScriptStruct'"/Script/CoreUObject.LinearColor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",AutogeneratedDefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) CustomProperties Pin (PinId=4BB35F3843730E751593D6AB6DA8BF0F,PinName="Duration",PinToolTip="Duration\\nFloat",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.000000",AutogeneratedDefaultValue="2.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) End Object

## COMMON FUNCTION REFERENCES

Use these exact paths for common functions:

| Function | MemberParent | MemberName |
|----------|--------------|------------|
| PrintString | Class'"/Script/Engine.KismetSystemLibrary"' | PrintString |
| Delay | Class'"/Script/Engine.KismetSystemLibrary"' | Delay |
| GetActorLocation | Class'"/Script/Engine.Actor"' | K2_GetActorLocation |
| SetActorLocation | Class'"/Script/Engine.Actor"' | K2_SetActorLocation |
| GetActorRotation | Class'"/Script/Engine.Actor"' | K2_GetActorRotation |
| SetActorRotation | Class'"/Script/Engine.Actor"' | K2_SetActorRotation |
| GetPlayerController | Class'"/Script/Engine.GameplayStatics"' | GetPlayerController |
| GetPlayerCharacter | Class'"/Script/Engine.GameplayStatics"' | GetPlayerCharacter |
| GetPlayerPawn | Class'"/Script/Engine.GameplayStatics"' | GetPlayerPawn |
| SpawnActor | Class'"/Script/Engine.GameplayStatics"' | BeginDeferredActorSpawnFromClass |
| DestroyActor | Class'"/Script/Engine.Actor"' | K2_DestroyActor |
| GetAllActorsOfClass | Class'"/Script/Engine.GameplayStatics"' | GetAllActorsOfClass |
| LineTraceSingle | Class'"/Script/Engine.KismetSystemLibrary"' | LineTraceSingle |
| ApplyDamage | Class'"/Script/Engine.GameplayStatics"' | ApplyDamage |
| PlaySound2D | Class'"/Script/Engine.GameplayStatics"' | PlaySound2D |
| SetTimer | Class'"/Script/Engine.KismetSystemLibrary"' | K2_SetTimer |
| VectorLength | Class'"/Script/Engine.KismetMathLibrary"' | VSize |
| Normalize | Class'"/Script/Engine.KismetMathLibrary"' | Normal |
| GetForwardVector | Class'"/Script/Engine.Actor"' | GetActorForwardVector |
| GetDistanceTo | Class'"/Script/Engine.Actor"' | GetDistanceTo |
| MakeVector | Class'"/Script/Engine.KismetMathLibrary"' | MakeVector |
| BreakVector | Class'"/Script/Engine.KismetMathLibrary"' | BreakVector |
| Add_VectorVector | Class'"/Script/Engine.KismetMathLibrary"' | Add_VectorVector |
| Subtract_VectorVector | Class'"/Script/Engine.KismetMathLibrary"' | Subtract_VectorVector |
| Multiply_VectorFloat | Class'"/Script/Engine.KismetMathLibrary"' | Multiply_VectorFloat |

## COMMON NODE TYPES

### K2Node_Event - Events (execution start)
- BeginPlay: EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveBeginPlay")
- Tick: EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveTick")
- ActorBeginOverlap: EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveActorBeginOverlap")

### K2Node_IfThenElse - Branch
Has pins: execute (input), Condition (bool input), then/True (exec output), else/False (exec output)

### K2Node_VariableGet - Get Variable
VariableReference=(MemberName="{VarName}",MemberGuid={GUID},bSelfContext=True)

### K2Node_VariableSet - Set Variable
Same as Get but has execute/then pins for impure operation

## IMPORTANT RULES

1. ALWAYS generate valid GUIDs (32 hex chars) for NodeGuid and PinId
2. ALWAYS include bidirectional LinkedTo references (both pins must reference each other)
3. Pure functions (bIsPureFunc=True) have NO exec pins
4. Impure functions MUST have "execute" input and "then" output exec pins
5. Self/Target pins should have bHidden=True
6. WorldContextObject pins should have bHidden=True
7. Use correct PinType.PinSubCategoryObject for struct types (Vector, Rotator, etc.)
8. Boolean DefaultValue must be lowercase: "true" or "false"
9. Position nodes left-to-right, events at X=-416

Now generate the Blueprint code for the user's request. Output ONLY the raw blueprint code, no explanations.`;

// Demo blueprints for testing without API key
const DEMO_BLUEPRINTS = {
    "hello": `Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveBeginPlay") bOverrideFunction=True NodePosX=-416 NodePosY=0 NodeGuid=521B69F742A30F8EA5B92B8CC131AB54 CustomProperties Pin (PinId=71907A84935B4C5CAAB3008925461DF1,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 25CB1132A7BA49AB925A8FA318964E23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString") NodePosX=0 NodePosY=0 NodeGuid=A6A251FD44C9D09ACE54E19DF6182B12 CustomProperties Pin (PinId=25CB1132A7BA49AB925A8FA318964E23,PinName="execute",PinToolTip="\\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 71907A84935B4C5CAAB3008925461DF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=0342A5C2A6524BC496509A5FE3E7878B,PinName="then",PinToolTip="\\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=061FD7FAE33B40F49B6F736AEBD0FDA9,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultSelfPin=True,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=2979C783471D7D4804442187DA27A521,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=E2CDE5CF495D61BD0B8F1A86A55FB888,PinName="InString",PinToolTip="In String\\nString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Hello World",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=3AA822D74CADE493F2FA9D83887A5DD3,PinName="bPrintToScreen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) CustomProperties Pin (PinId=8E746F6B4B704C47A71B84801EF2507A,PinName="bPrintToLog",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",AutogeneratedDefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) CustomProperties Pin (PinId=DC67C1C9461616C13CD468A6A2F4A4AF,PinName="TextColor",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.ScriptStruct'"/Script/CoreUObject.LinearColor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",AutogeneratedDefaultValue="(R=0.000000,G=0.660000,B=1.000000,A=1.000000)",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) CustomProperties Pin (PinId=4BB35F3843730E751593D6AB6DA8BF0F,PinName="Duration",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.000000",AutogeneratedDefaultValue="2.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) End Object`,

    "branch": `Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveBeginPlay") bOverrideFunction=True NodePosX=-416 NodePosY=0 NodeGuid=521B69F742A30F8EA5B92B8CC131AB54 CustomProperties Pin (PinId=71907A84935B4C5CAAB3008925461DF1,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_IfThenElse Name="K2Node_IfThenElse_0" NodePosX=0 NodePosY=0 NodeGuid=C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6 CustomProperties Pin (PinId=D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 71907A84935B4C5CAAB3008925461DF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6,PinName="Condition",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6,PinName="then",PinFriendlyName="True",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 25CB1132A7BA49AB925A8FA318964E23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D7,PinName="else",PinFriendlyName="False",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 35CB1132A7BA49AB925A8FA318964E24,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString") NodePosX=300 NodePosY=-50 NodeGuid=A6A251FD44C9D09ACE54E19DF6182B12 CustomProperties Pin (PinId=25CB1132A7BA49AB925A8FA318964E23,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=0342A5C2A6524BC496509A5FE3E7878B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=061FD7FAE33B40F49B6F736AEBD0FDA9,PinName="self",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultSelfPin=True,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=2979C783471D7D4804442187DA27A521,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=E2CDE5CF495D61BD0B8F1A86A55FB888,PinName="InString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Condition is TRUE",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=3AA822D74CADE493F2FA9D83887A5DD3,PinName="bPrintToScreen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString") NodePosX=300 NodePosY=100 NodeGuid=B7B362FE55D9E0ABDF65F29EG7293C23 CustomProperties Pin (PinId=35CB1132A7BA49AB925A8FA318964E24,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_IfThenElse_0 A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D7,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=1342A5C2A6524BC496509A5FE3E7878C,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=161FD7FAE33B40F49B6F736AEBD0FDA0,PinName="self",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultSelfPin=True,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=3979C783471D7D4804442187DA27A522,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=F2CDE5CF495D61BD0B8F1A86A55FB889,PinName="InString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Condition is FALSE",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=4AA822D74CADE493F2FA9D83887A5DD4,PinName="bPrintToScreen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) End Object`,

    "location": `Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveBeginPlay") bOverrideFunction=True NodePosX=-416 NodePosY=0 NodeGuid=521B69F742A30F8EA5B92B8CC131AB54 CustomProperties Pin (PinId=71907A84935B4C5CAAB3008925461DF1,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 25CB1132A7BA49AB925A8FA318964E23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" bIsPureFunc=True FunctionReference=(MemberParent=Class'"/Script/Engine.Actor"',MemberName="K2_GetActorLocation") NodePosX=-200 NodePosY=100 NodeGuid=B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2 CustomProperties Pin (PinId=A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.Actor"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=F1E2D3C4B5A6F7E8D9C0B1A2F3E4D5C6,PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="struct",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.ScriptStruct'"/Script/CoreUObject.Vector"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 G2CDE5CF495D61BD0B8F1A86A55FB890,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString") NodePosX=200 NodePosY=0 NodeGuid=C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3 CustomProperties Pin (PinId=25CB1132A7BA49AB925A8FA318964E23,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 71907A84935B4C5CAAB3008925461DF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=0342A5C2A6524BC496509A5FE3E7878B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=061FD7FAE33B40F49B6F736AEBD0FDA9,PinName="self",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultSelfPin=True,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=2979C783471D7D4804442187DA27A521,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=G2CDE5CF495D61BD0B8F1A86A55FB890,PinName="InString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 F1E2D3C4B5A6F7E8D9C0B1A2F3E4D5C6,),DefaultValue="",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=3AA822D74CADE493F2FA9D83887A5DD3,PinName="bPrintToScreen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) End Object`,

    "delay": `Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0" EventReference=(MemberParent=/Script/Engine.Actor,MemberName="ReceiveBeginPlay") bOverrideFunction=True NodePosX=-416 NodePosY=0 NodeGuid=521B69F742A30F8EA5B92B8CC131AB54 CustomProperties Pin (PinId=71907A84935B4C5CAAB3008925461DF1,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 88CB1132A7BA49AB925A8FA318964E23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_0" bIsLatent=True FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="Delay") NodePosX=0 NodePosY=0 NodeGuid=B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2 CustomProperties Pin (PinId=88CB1132A7BA49AB925A8FA318964E23,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Event_0 71907A84935B4C5CAAB3008925461DF1,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=99DB2243B8CB5AAB036B9FB429075F34,PinName="Completed",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_1 25CB1132A7BA49AB925A8FA318964E23,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=AABB1234567890ABCDEF1234567890AB,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=CCDD5678901234ABCDEF5678901234CD,PinName="Duration",PinType.PinCategory="real",PinType.PinSubCategory="float",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="2.000000",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) End Object
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_1" FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString") NodePosX=400 NodePosY=0 NodeGuid=C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3 CustomProperties Pin (PinId=25CB1132A7BA49AB925A8FA318964E23,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_CallFunction_0 99DB2243B8CB5AAB036B9FB429075F34,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=0342A5C2A6524BC496509A5FE3E7878B,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=061FD7FAE33B40F49B6F736AEBD0FDA9,PinName="self",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultSelfPin=True,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=2979C783471D7D4804442187DA27A521,PinName="WorldContextObject",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=/Script/CoreUObject.Class'"/Script/CoreUObject.Object"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=E2CDE5CF495D61BD0B8F1A86A55FB888,PinName="InString",PinType.PinCategory="string",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="Done!",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) CustomProperties Pin (PinId=3AA822D74CADE493F2FA9D83887A5DD3,PinName="bPrintToScreen",PinType.PinCategory="bool",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="true",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=True,bOrphanedPin=False,) End Object`
};

class BlueprintGenerator {
    constructor() {
        this.apiKey = null;
        this.model = 'claude-sonnet-4-20250514';
        this.maxTokens = 8192;
        this.demoMode = false;
    }

    saveApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('blueprint_api_key', key);
    }

    loadApiKey() {
        this.apiKey = localStorage.getItem('blueprint_api_key');
        return this.apiKey;
    }

    async generate(userPrompt) {
        // Check for demo mode
        if (this.demoMode || !this.apiKey) {
            return this.generateDemo(userPrompt);
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: this.model,
                max_tokens: this.maxTokens,
                system: SYSTEM_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }

        const data = await response.json();
        const blueprint = data.content[0].text;

        return {
            blueprint: blueprint,
            usage: data.usage
        };
    }

    generateDemo(userPrompt) {
        // Simulate delay for demo
        return new Promise((resolve) => {
            setTimeout(() => {
                const prompt = userPrompt.toLowerCase();
                let blueprint;

                // Match prompt to demo blueprints
                if (prompt.includes('branch') || prompt.includes('if') || prompt.includes('condition')) {
                    blueprint = DEMO_BLUEPRINTS.branch;
                } else if (prompt.includes('location') || prompt.includes('position') || prompt.includes('get actor')) {
                    blueprint = DEMO_BLUEPRINTS.location;
                } else if (prompt.includes('delay') || prompt.includes('wait') || prompt.includes('timer')) {
                    blueprint = DEMO_BLUEPRINTS.delay;
                } else if (prompt.includes('hello') || prompt.includes('print')) {
                    blueprint = DEMO_BLUEPRINTS.hello;
                } else {
                    // Default to hello world
                    blueprint = DEMO_BLUEPRINTS.hello;
                }

                resolve({
                    blueprint: blueprint,
                    usage: { total_tokens: 0 },
                    demo: true
                });
            }, 500); // Simulate network delay
        });
    }

    validateBlueprint(code) {
        const errors = [];
        let nodeCount = 0;

        // Check for Begin Object / End Object pairs
        const beginCount = (code.match(/Begin Object/g) || []).length;
        const endCount = (code.match(/End Object/g) || []).length;

        if (beginCount !== endCount) {
            errors.push(`Mismatched Begin/End Object: ${beginCount} begins, ${endCount} ends`);
        }

        nodeCount = beginCount;

        // Check for required Class attribute
        const classMatches = code.match(/Class=([^\s]+)/g) || [];
        if (classMatches.length < beginCount) {
            errors.push('Some nodes missing Class attribute');
        }

        // Check for NodeGuid
        const guidMatches = code.match(/NodeGuid=[A-F0-9]{32}/gi) || [];
        if (guidMatches.length < beginCount) {
            errors.push('Some nodes missing NodeGuid');
        }

        // Check for valid node classes
        const validClasses = [
            'K2Node_Event',
            'K2Node_CallFunction',
            'K2Node_IfThenElse',
            'K2Node_VariableGet',
            'K2Node_VariableSet',
            'K2Node_Self',
            'K2Node_Literal',
            'K2Node_Knot',
            'K2Node_CustomEvent',
            'K2Node_InputAction',
            'K2Node_InputKey',
            'K2Node_MacroInstance',
            'K2Node_ExecutionSequence',
            'K2Node_MakeArray',
            'K2Node_GetArrayItem',
            'K2Node_Timeline',
            'K2Node_SpawnActor',
            'K2Node_SpawnActorFromClass',
            'K2Node_DynamicCast',
            'K2Node_FunctionEntry',
            'K2Node_FunctionResult',
            'K2Node_Tunnel',
            'K2Node_Select',
            'K2Node_SwitchEnum',
            'K2Node_SwitchInteger',
            'K2Node_SwitchString',
            'K2Node_AssignmentStatement',
            'K2Node_PromotableOperator',
            'K2Node_CommutativeAssociativeBinaryOperator'
        ];

        // Check that LinkedTo references are valid format
        const linkedToMatches = code.match(/LinkedTo=\([^)]*\)/g) || [];
        for (const match of linkedToMatches) {
            if (match !== 'LinkedTo=()' && !match.match(/LinkedTo=\(K2Node_\w+_\d+ [A-F0-9]{32},?\)/i)) {
                // Not an error if it's a valid format with node reference
                const innerMatch = match.match(/LinkedTo=\(([^)]+)\)/);
                if (innerMatch && innerMatch[1]) {
                    const refs = innerMatch[1].split(',').filter(r => r.trim());
                    for (const ref of refs) {
                        if (!ref.match(/K2Node_\w+_\d+\s+[A-F0-9]{32}/i)) {
                            errors.push(`Invalid LinkedTo format: ${match}`);
                            break;
                        }
                    }
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            nodeCount: nodeCount
        };
    }
}

// Export for use
window.blueprintGenerator = new BlueprintGenerator();
