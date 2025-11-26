import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Loader2, 
  Zap, 
  BookOpen, 
  Search, 
  ExternalLink, 
  Play, 
  Save, 
  Settings, 
  XCircle, 
  CheckCircle2,
  Terminal,
  LayoutTemplate,
  Plus,
  ToggleLeft,
  ToggleRight,
  FileCode,
  Cpu,
  Columns,
  Box,
  Key,
  Bot
} from 'lucide-react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  reconnectEdge,
  Connection, 
  Edge,
  Node,
  OnReconnect,
  ReactFlowProvider
} from '@xyflow/react';
import { generateBlueprint, ProviderPreference } from './services/geminiService';
import { GeneratedBlueprint, BlueprintNodeData, BlueprintVariable, BlueprintFunction, PinType, UE_COLORS } from './types';
import { instantiateBlueprintPlan } from './ue/nodeFactory';
import BlueprintCanvas from './components/BlueprintCanvas';
import { getLayoutedElements } from './utils/autoLayout';

interface LogEntry {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'verbose';
  message: string;
  timestamp: string;
}

const THINKING_MESSAGES = [
  "Initializing UBlueprintFactory...",
  "Parsing UK2Node requirements from prompt...",
  "Searching FProperty registry for type matches...",
  "Validating UFunction signatures in KismetSystemLibrary...",
  "Checking EdGraphSchema_K2 for valid connections...",
  "Resolving FKismetCompilerContext constraints...",
  "Constructing Directed Acyclic Graph (DAG) for Blueprint...",
  "Transpiling Graph to Native C++ Implementation...",
  "Compiling bytecode and optimizing wire routing..."
];

const SAMPLE_BLUEPRINT_PLAN = {
  nodePlan: [
    {
      id: "EntryEvent",
      nodeKey: "CustomEvent",
      comment: "Offline preview entry point"
    },
    {
      id: "SetupSequence",
      nodeKey: "Sequence",
      comment: "Fan out to multiple exec paths"
    },
    {
      id: "DoOnceNode",
      nodeKey: "DoOnce",
      comment: "Macro gating example",
      pinValues: {
        "Start Closed": "false"
      }
    },
    {
      id: "FlipFlopNode",
      nodeKey: "FlipFlop",
      comment: "Alternates between outputs"
    },
    {
      id: "FirstPrint",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Sequence path A -> First activation",
        Duration: "1.0"
      }
    },
    {
      id: "DelayNode",
      nodeKey: "Delay",
      pinValues: {
        Duration: "0.35"
      }
    },
    {
      id: "NavGridNode",
      nodeKey: "AddLocalNavigationGridForBox",
      comment: "Sample gameplay function",
      pinValues: {
        Extent: '"(X=256,Y=256,Z=64)"',
        Rotation: '"(Pitch=0,Yaw=45,Roll=0)"',
        Radius2D: "4",
        Height: "120.0",
        bRebuildGrids: "true"
      }
    },
    {
      id: "NavGridPrint",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Navigation grid added after delay",
        bPrintToScreen: "false"
      }
    },
    {
      id: "TraceNode",
      nodeKey: "LineTraceForObjects",
      comment: "Physics style call",
      pinValues: {
        Start: '"(X=0,Y=0,Z=240)"',
        End: '"(X=0,Y=0,Z=-200)"',
        DrawDebugType: "ForDuration",
        DrawTime: "0.75"
      }
    },
    {
      id: "TraceBranch",
      nodeKey: "Branch",
      comment: "True when trace hits"
    },
    {
      id: "TraceHitPrint",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Trace hit actor",
        TextColor: '"(R=0,G=0.85,B=0,A=1)"',
        Duration: "0.6"
      }
    },
    {
      id: "TraceMissPrint",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Trace missed",
        TextColor: '"(R=1,G=0.35,B=0,A=1)"',
        Duration: "0.6"
      }
    },
    {
      id: "LoopNode",
      nodeKey: "ForEachLoop",
      comment: "Iterate mock array",
      pinValues: {
        Array: "[BP_Light, BP_Door, BP_Switch]"
      }
    },
    {
      id: "IsValidNode",
      nodeKey: "IsValid",
      comment: "Object guard"
    },
    {
      id: "LoopPrint",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Valid loop entry processed",
        bPrintToLog: "true"
      }
    },
    {
      id: "LoopComplete",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Loop complete",
        bPrintToScreen: "false"
      }
    },
    {
      id: "AxisEvent",
      nodeKey: "MouseX",
      comment: "Input axis sample"
    },
    {
      id: "AxisCompare",
      nodeKey: ">=",
      comment: "Simple threshold",
      pinValues: {
        B: "0.5"
      }
    },
    {
      id: "AxisBranch",
      nodeKey: "Branch",
      comment: "Gates axis intensity"
    },
    {
      id: "AxisHigh",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Fast camera pan detected"
      }
    },
    {
      id: "AxisLow",
      nodeKey: "PrintString",
      pinValues: {
        InString: "Axis idle / below threshold",
        bPrintToScreen: "false"
      }
    }
  ],
  edgePlan: [
    {
      source: { node: "EntryEvent", pin: "then" },
      target: { node: "SetupSequence", pin: "execute" }
    },
    {
      source: { node: "SetupSequence", pin: "then_0" },
      target: { node: "DoOnceNode", pin: "execute" }
    },
    {
      source: { node: "DoOnceNode", pin: "Completed" },
      target: { node: "FlipFlopNode", pin: "Pin" }
    },
    {
      source: { node: "FlipFlopNode", pin: "A" },
      target: { node: "FirstPrint", pin: "execute" }
    },
    {
      source: { node: "FlipFlopNode", pin: "B" },
      target: { node: "DelayNode", pin: "execute" }
    },
    {
      source: { node: "DelayNode", pin: "then" },
      target: { node: "NavGridNode", pin: "execute" }
    },
    {
      source: { node: "NavGridNode", pin: "then" },
      target: { node: "NavGridPrint", pin: "execute" }
    },
    {
      source: { node: "SetupSequence", pin: "then_1" },
      target: { node: "TraceNode", pin: "execute" }
    },
    {
      source: { node: "TraceNode", pin: "then" },
      target: { node: "TraceBranch", pin: "execute" }
    },
    {
      source: { node: "TraceBranch", pin: "then" },
      target: { node: "TraceHitPrint", pin: "execute" }
    },
    {
      source: { node: "TraceBranch", pin: "else" },
      target: { node: "TraceMissPrint", pin: "execute" }
    },
    {
      source: { node: "SetupSequence", pin: "then_2" },
      target: { node: "LoopNode", pin: "Exec" }
    },
    {
      source: { node: "LoopNode", pin: "LoopBody" },
      target: { node: "IsValidNode", pin: "exec" }
    },
    {
      source: { node: "IsValidNode", pin: "Is Valid" },
      target: { node: "LoopPrint", pin: "execute" }
    },
    {
      source: { node: "LoopNode", pin: "Completed" },
      target: { node: "LoopComplete", pin: "execute" }
    },
    {
      source: { node: "AxisEvent", pin: "then" },
      target: { node: "AxisBranch", pin: "execute" }
    },
    {
      source: { node: "AxisBranch", pin: "then" },
      target: { node: "AxisHigh", pin: "execute" }
    },
    {
      source: { node: "AxisBranch", pin: "else" },
      target: { node: "AxisLow", pin: "execute" }
    },
    {
      source: { node: "AxisEvent", pin: "AxisValue" },
      target: { node: "AxisCompare", pin: "A" }
    },
    {
      source: { node: "AxisCompare", pin: "ReturnValue" },
      target: { node: "AxisBranch", pin: "Condition" }
    },
    {
      source: { node: "TraceNode", pin: "ReturnValue" },
      target: { node: "TraceBranch", pin: "Condition" }
    },
    {
      source: { node: "TraceNode", pin: "OutHit_Location" },
      target: { node: "NavGridNode", pin: "Location" }
    },
    {
      source: { node: "TraceNode", pin: "OutHit_HitActor" },
      target: { node: "IsValidNode", pin: "InputObject" }
    },
    {
      source: { node: "LoopNode", pin: "Array Element" },
      target: { node: "LoopPrint", pin: "InString" }
    }
  ]
};

const SAMPLE_CPP_SNIPPET = `#include "SamplePreviewActor.h"

void ASamplePreviewActor::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    const bool bTraceHit = SampleHelpers::DebugTrace(GetActorLocation());
    if (bTraceHit)
    {
        UE_LOG(LogTemp, Log, TEXT("Trace resolved actor, broadcasting status"));
    }
}`;

// Simple C++ Syntax Highlighter for Vibe
const highlightCpp = (code: string) => {
  if (!code) return '';

  // Escape HTML entities to prevent XSS (though source is AI generated logic)
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Tokenize by splitting Comments, Strings, Preprocessor, and Code
  // Regex captures: // comments, "strings", #directives
  const parts = escaped.split(/(\/\/.*$|"[^"]*"|#\w+.*$)/gm);

  return parts.map((part) => {
    if (part.startsWith('//')) {
      return `<span class="text-[#6A9955]">${part}</span>`; // Comment Green
    } else if (part.startsWith('"')) {
      return `<span class="text-[#CE9178]">${part}</span>`; // String Orange
    } else if (part.startsWith('#')) {
      return `<span class="text-[#C586C0]">${part}</span>`; // Directive Purple
    } else {
      // Process Code: Keywords, Types, Functions
      return part
        // Keywords (void, int, float, double, bool, char, auto, const, virtual, override, nullptr, true, false, this, Super)
        .replace(/\b(void|int|float|double|bool|char|auto|const|virtual|override|nullptr|true|false|this|Super)\b/g, '<span class="text-[#569CD6]">$1</span>')
        // Control Flow (if, else, return, for, while)
        .replace(/\b(if|else|return|for|while|do|switch|case|break|continue)\b/g, '<span class="text-[#C586C0]">$1</span>')
        // UE Macros (UFUNCTION, UPROPERTY, GENERATED_BODY|TEXT)\b/g, '<span class="text-[#DCDCAA]">$1</span>')
        // Classes/Types (Start with U, A, F, E followed by capital letter)
        .replace(/\b([UAFE][A-Z]\w+)\b/g, '<span class="text-[#4EC9B0]">$1</span>')
        // Function Calls (Word followed by open parenthesis)
        .replace(/\b(\w+)(?=\()/g, '<span class="text-[#DCDCAA]">$1</span>');
    }
  }).join('');
};

function App() {
  // Graph State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Application State
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [verboseMode, setVerboseMode] = useState(false);
  const [viewMode, setViewMode] = useState<'blueprint' | 'cpp' | 'split'>('blueprint');
  const [blueprintSummary, setBlueprintSummary] = useState<string>('');
  const [blueprintSources, setBlueprintSources] = useState<Array<{title: string, url: string}>>([]);
  const [targetClass, setTargetClass] = useState<string>('BP_GeneratedActor');
  const [showSettings, setShowSettings] = useState(false);
  
  // API Keys
  // Fallback to old key name for backward compatibility during migration
  const [userGeminiKey, setUserGeminiKey] = useState(localStorage.getItem('BLUEPRINT_VIBE_GEMINI_KEY') || localStorage.getItem('BLUEPRINT_VIBE_API_KEY') || '');
  const [userOpenAIKey, setUserOpenAIKey] = useState(localStorage.getItem('BLUEPRINT_VIBE_OPENAI_KEY') || '');
  const [providerPreference, setProviderPreference] = useState<ProviderPreference>(
    (localStorage.getItem('BLUEPRINT_VIBE_PROVIDER') as ProviderPreference) || 'auto'
  );
  
  // C++ State
  const [generatedCpp, setGeneratedCpp] = useState<string>('');
  const [displayedCpp, setDisplayedCpp] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  
  // Sidebar Data State (My Blueprint)
  const [variables, setVariables] = useState<BlueprintVariable[]>([]);
  const [functions, setFunctions] = useState<BlueprintFunction[]>([]);

  // Compilation State
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileStatus, setCompileStatus] = useState<'dirty' | 'success' | 'error'>('dirty');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showOutputLog, setShowOutputLog] = useState(true);

  // Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling
  const thinkingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const edgeReconnectSuccessful = useRef(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  // Output Log Auto-Scroll
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showOutputLog]);

  // C++ Typing Effect
  useEffect(() => {
    if (!generatedCpp) {
      setDisplayedCpp('');
      return;
    }

    setDisplayedCpp('');
    let currentIndex = 0;
    const speed = 3; // chars per tick
    
    const typingInterval = setInterval(() => {
      if (currentIndex >= generatedCpp.length) {
        setDisplayedCpp(generatedCpp);
        clearInterval(typingInterval);
        return;
      }
      
      setDisplayedCpp(generatedCpp.slice(0, currentIndex + speed));
      currentIndex += speed;
    }, 5); // tick duration in ms

    return () => clearInterval(typingInterval);
  }, [generatedCpp]);

  // Handlers
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((prevEdges) => {
        let newEdges = prevEdges;
        const targetNode = nodes.find(n => n.id === params.target);
        const sourceNode = nodes.find(n => n.id === params.source);

        let edgeColor = UE_COLORS.Default;
        let strokeWidth = 2;

        if (targetNode && sourceNode) {
          const targetPin = targetNode.data.inputs.find((p: any) => p.id === params.targetHandle);
          const sourcePin = sourceNode.data.outputs.find((p: any) => p.id === params.sourceHandle);

          // Determine Color based on Source Pin Type
          if (sourcePin) {
             switch(sourcePin.type) {
                 case PinType.Exec: edgeColor = UE_COLORS.Exec; strokeWidth = 2.5; break;
                 case PinType.Boolean: edgeColor = UE_COLORS.Boolean; break;
                 case PinType.Integer: edgeColor = UE_COLORS.Integer; break;
                 case PinType.Float: edgeColor = UE_COLORS.Float; break;
                 case PinType.String: edgeColor = UE_COLORS.String; break;
                 case PinType.Vector: edgeColor = UE_COLORS.Vector; break;
                 case PinType.Rotator: edgeColor = UE_COLORS.Rotator; break;
                 case PinType.Object: edgeColor = UE_COLORS.Object; break; // BLUE WIRES FOR OBJECTS
                 case PinType.Class: edgeColor = UE_COLORS.Class; break;
                 case PinType.Struct: edgeColor = UE_COLORS.Struct; break;
                 case PinType.Class: edgeColor = UE_COLORS.Class; break;
                 case PinType.Text: edgeColor = UE_COLORS.Text; break;
                 case PinType.Name: edgeColor = UE_COLORS.Name; break;
             }
          }

          // UE5 Rule 1: Data Inputs (non-exec) accept only ONE connection.
          if (targetPin && targetPin.type !== PinType.Exec) {
            newEdges = newEdges.filter(e => e.targetHandle !== params.targetHandle);
          }

          // UE5 Rule 2: Exec Outputs accept only ONE connection.
          if (sourcePin && sourcePin.type === PinType.Exec) {
            newEdges = newEdges.filter(e => e.sourceHandle !== params.sourceHandle);
          }
        }

        const newEdge = {
            ...params,
            type: 'default',
            animated: false,
            style: { stroke: edgeColor, strokeWidth: strokeWidth },
        };

        return addEdge(newEdge, newEdges);
      });
    },
    [setEdges, nodes],
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges],
  );

  const onReconnectEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = false;
    },
    [setEdges],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      // Alt + Click to remove edge
      if (event.altKey) {
        event.preventDefault();
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        addLog('info', `Disconnected link: ${edge.source} -> ${edge.target}`);
      }
    },
    [setEdges]
  );

  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [nodes, edges, setNodes, setEdges]);

  const addLog = (type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [...prev, entry]);
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setLogs([]); // Clear previous compile logs
    addLog('info', 'Starting Blueprint Compilation...');
    
    // Simulate UE5 Compile times
    setTimeout(() => {
      addLog('verbose', 'Compiling class GenerateBlueprint_C...');
      addLog('verbose', 'Binding variable references...');
      
      const hasEvents = nodes.some(n => n.data.nodeType === 'event');
      const hasBrokenLinks = false; // logic placeholder

      if (nodes.length === 0) {
        addLog('warning', 'Graph is empty. Nothing to compile.');
        setIsCompiling(false);
        setCompileStatus('success');
        return;
      }

      if (!hasEvents) {
        addLog('warning', 'Blueprint has no Entry Point (Event). Logic may not execute.');
      }

      addLog('success', `Compile Complete! [${nodes.length} nodes, ${edges.length} edges]`);
      setIsCompiling(false);
      setCompileStatus('success');
    }, 1200);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('BLUEPRINT_VIBE_GEMINI_KEY', userGeminiKey);
    localStorage.setItem('BLUEPRINT_VIBE_OPENAI_KEY', userOpenAIKey);
    // Maintain backward compatibility for now
    localStorage.setItem('BLUEPRINT_VIBE_API_KEY', userGeminiKey);
    localStorage.setItem('BLUEPRINT_VIBE_PROVIDER', providerPreference);
    
    setShowSettings(false);
    addLog('success', 'API Keys saved to local storage.');
  };

  const populateBlueprintFromResult = (result: GeneratedBlueprint) => {
    if (result.variables) {
      setVariables(prev => {
        const existingIds = new Set(prev.map(v => v.id));
        const newVars = (result.variables || []).filter(v => !existingIds.has(v.id));
        return [...prev, ...newVars];
      });
    }

    if (result.functions) {
      setFunctions(prev => {
        const existingIds = new Set(prev.map(f => f.id));
        const newFuncs = (result.functions || []).filter(f => !existingIds.has(f.id));
        return [...prev, ...newFuncs];
      });
    }

    setBlueprintSummary(result.summary || 'No summary provided.');
    setBlueprintSources(result.sources || []);
    setGeneratedCpp(result.cppCode || '');
    setTargetClass(result.targetClass || 'BP_GeneratedActor');

    const safeNodes = result.nodes || [];
    const safeEdges = result.edges || [];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      safeNodes,
      safeEdges
    );

    const coloredEdges = layoutedEdges.map(edge => {
      const sourceNode = layoutedNodes.find(n => n.id === edge.source);
      const sourcePin = sourceNode?.data.outputs.find((p: any) => p.id === edge.sourceHandle);
      let color = UE_COLORS.Default;
      let width = 2;
      if (sourcePin) {
        switch (sourcePin.type) {
          case PinType.Exec: color = UE_COLORS.Exec; width = 2.5; break;
          case PinType.Boolean: color = UE_COLORS.Boolean; break;
          case PinType.Integer: color = UE_COLORS.Integer; break;
          case PinType.Float: color = UE_COLORS.Float; break;
          case PinType.String: color = UE_COLORS.String; break;
          case PinType.Vector: color = UE_COLORS.Vector; break;
          case PinType.Rotator: color = UE_COLORS.Rotator; break;
          case PinType.Object: color = UE_COLORS.Object; break;
          case PinType.Class: color = UE_COLORS.Class; break;
          case PinType.Struct: color = UE_COLORS.Struct; break;
          case PinType.Name: color = UE_COLORS.Name; break;
          case PinType.Text: color = UE_COLORS.Text; break;
        }
      }
      return {
        ...edge,
        type: 'default',
        style: { stroke: color, strokeWidth: width },
        animated: false
      };
    });

    setNodes(layoutedNodes);
    setEdges(coloredEdges);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setCompileStatus('dirty');
    
    // Verbose Mode Logic
    if (verboseMode) {
      setShowOutputLog(true);
      setLogs([]); // Clear logs for fresh "thinking" view
      addLog('info', `Initialize generation for: "${prompt}"`);
      
      let msgIndex = 0;
      thinkingInterval.current = setInterval(() => {
        if (msgIndex < THINKING_MESSAGES.length) {
          addLog('verbose', THINKING_MESSAGES[msgIndex]);
          msgIndex++;
        }
      }, 800);
    }

    try {
      const result = await generateBlueprint(prompt, providerPreference);
      
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);

      populateBlueprintFromResult(result);

      if (verboseMode) {
        addLog('success', 'Graph generation complete.');
        if (result.cppCode) {
            addLog('info', 'LogNative: C++ Code generated successfully.');
        }
      }

    } catch (err: any) {
      console.error(err);
      if (thinkingInterval.current) clearInterval(thinkingInterval.current);
      const friendlyError = err?.message || "Failed to generate blueprint. Please try again.";
      setError(friendlyError);
      addLog('error', `Generation failed: ${friendlyError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariable = () => {
    const id = `Var_${Date.now()}`;
    setVariables([...variables, { id, name: 'NewVar', type: PinType.Boolean, defaultValue: 'false' }]);
  };

  const handleAddFunction = () => {
    const id = `Func_${Date.now()}`;
    setFunctions([...functions, { id, name: 'NewFunction', inputs: [], outputs: [] }]);
  };

  const handleLoadSampleGraph = () => {
    const { nodes: sampleNodes, edges: sampleEdges } = instantiateBlueprintPlan(
      SAMPLE_BLUEPRINT_PLAN.nodePlan,
      SAMPLE_BLUEPRINT_PLAN.edgePlan
    );

    populateBlueprintFromResult({
      nodes: sampleNodes,
      edges: sampleEdges,
      summary:
        "- Sequence preview covering events, traces, loops, and math\n- Demonstrates exec + data wires without hitting Gemini",
      cppCode: SAMPLE_CPP_SNIPPET,
      targetClass: "BP_SamplePreview",
      variables: [],
      functions: [],
      sources: []
    });

    setPrompt('');
    setError(null);
    setCompileStatus('dirty');
    addLog('info', 'Loaded sample blueprint preview (offline).');
  };

  // Reusable C++ View Renderer
  const renderCppView = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-neutral-300 overflow-hidden">
        <div className="bg-[#1e1e1e] p-0 w-full h-full font-mono text-xs text-gray-300 relative flex flex-col">
            {/* Header */}
            <div className="w-full h-8 bg-[#252526] border-b border-[#3e3e42] flex items-center px-4 gap-2 shrink-0">
                <FileCode size={12} className="text-[#4EC9B0]" />
                <span className="text-[#CCCCCC] text-[11px] font-medium">GeneratedActor.cpp</span>
            </div>
            {/* Code Content */}
            <div className="p-4 bg-[#1e1e1e] overflow-auto custom-scrollbar flex-1 relative">
                {displayedCpp ? (
                    <pre 
                      className="font-mono text-[12px] leading-5 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: highlightCpp(displayedCpp) + '<span class="animate-pulse inline-block w-2 h-4 bg-white/50 align-middle ml-0.5"></span>' }}
                    />
                ) : (
                    <div className="opacity-50">
                        <div><span className="text-[#C586C0]">void</span> <span className="text-[#4EC9B0]">AGeneratedActor</span>::<span className="text-[#DCDCAA]">BeginPlay</span>()</div>
                        <div>{`{`}</div>
                        <div className="pl-4"><span className="text-[#4EC9B0]">Super</span>::<span className="text-[#DCDCAA]">BeginPlay</span>();</div>
                        <div className="pl-4 mb-2"></div>
                        <div className="pl-4 text-[#6A9955] italic">// Waiting for Blueprint logic generation...</div>
                        <div>{`}`}</div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col font-sans bg-[#151515] text-gray-200">
        
        {/* SETTINGS MODAL */}
        {showSettings && (
          <div className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center">
             <div className="bg-[#1a1a1a] w-[400px] border border-neutral-700 rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-[#222] px-4 py-3 border-b border-black flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <Settings size={16} className="text-gray-300" />
                      <span className="text-sm font-semibold text-gray-200">Settings</span>
                   </div>
                   <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white">
                      <XCircle size={16} />
                   </button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                   
                   {/* GEMINI KEY */}
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                        <Zap size={12} className="text-yellow-500" /> Gemini API Key
                      </label>
                      <div className="relative">
                         <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                         <input 
                           type="password"
                           value={userGeminiKey}
                           onChange={(e) => setUserGeminiKey(e.target.value)}
                           placeholder="Enter Gemini API Key..."
                           className="w-full bg-[#0a0a0a] border border-neutral-700 rounded py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-600"
                         />
                      </div>
                      <p className="text-[10px] text-neutral-500">
                         Get a key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">aistudio.google.com</a>.
                      </p>
                   </div>

                   <hr className="border-neutral-800" />

                   {/* OPENAI KEY */}
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                        <Bot size={12} className="text-green-500" /> OpenAI API Key
                      </label>
                      <div className="relative">
                         <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                         <input 
                           type="password"
                           value={userOpenAIKey}
                           onChange={(e) => setUserOpenAIKey(e.target.value)}
                           placeholder="Enter OpenAI API Key (Optional)..."
                           className="w-full bg-[#0a0a0a] border border-neutral-700 rounded py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-green-500 placeholder-neutral-600"
                         />
                      </div>
                      <p className="text-[10px] text-neutral-500">
                         Works with GPT-4o mini / legacy Codex style keys. Stored locally only.
                      </p>
                   </div>

                   <hr className="border-neutral-800" />

                   {/* PROVIDER SELECTION */}
                   <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                        <Cpu size={12} className="text-blue-400" /> Model Provider
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'auto', label: 'Auto', helper: 'Smart pick', Icon: Cpu },
                          { value: 'gemini', label: 'Gemini', helper: 'Google AI Studio', Icon: Zap },
                          { value: 'openai', label: 'OpenAI', helper: 'GPT / Codex', Icon: Bot }
                        ].map(({ value, label, helper, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setProviderPreference(value as ProviderPreference)}
                            className={`flex flex-col gap-1 rounded border px-3 py-2 text-left transition-all ${
                              providerPreference === value
                                ? 'border-blue-500/70 bg-blue-500/10 text-white shadow-[0_0_12px_rgba(0,112,224,0.35)]'
                                : 'border-neutral-700 bg-[#0a0a0a] text-neutral-400 hover:border-neutral-500'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={13} className={providerPreference === value ? 'text-blue-300' : 'text-neutral-500'} />
                              <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                            </div>
                            <span className="text-[9px] text-neutral-500">{helper}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        Auto prefers Gemini when both keys are set, otherwise falls back to OpenAI.
                      </p>
                   </div>

                   <button 
                      onClick={handleSaveSettings}
                      className="mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded py-2 text-xs font-semibold uppercase tracking-wide transition-colors"
                   >
                      Save Settings
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* TOP TOOLBAR */}
        <div className="h-12 bg-[#1a1a1a] border-b border-black flex items-center px-4 justify-between select-none z-50">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 mr-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-8 h-8 rounded flex items-center justify-center shadow-lg ring-1 ring-white/10">
                   <Zap size={18} className="text-white" fill="white" />
                </div>
                <h1 className="font-semibold text-gray-200 tracking-wide text-sm">blueprint-vibe</h1>
             </div>

             <div className="h-6 w-[1px] bg-neutral-700 mx-2"></div>

             {/* Action Buttons */}
             <div className="flex items-center gap-1">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-neutral-700 transition-colors text-xs font-medium text-gray-300">
                   <Save size={14} />
                   <span>Save</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-neutral-700 transition-colors text-xs font-medium text-gray-300">
                   <Search size={14} />
                   <span>Find</span>
                </button>
             </div>

             <div className="h-6 w-[1px] bg-neutral-700 mx-2"></div>

             {/* Compile Button */}
             <button 
                onClick={handleCompile}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-sm transition-all shadow-md group border border-transparent
                  ${compileStatus === 'dirty' ? 'bg-neutral-600 hover:bg-neutral-500 text-gray-200' : ''}
                  ${compileStatus === 'success' ? 'bg-green-700 hover:bg-green-600 text-white border-green-500/30' : ''}
                  ${compileStatus === 'error' ? 'bg-red-700 hover:bg-red-600 text-white' : ''}
                `}
             >
                {isCompiling ? (
                   <Loader2 size={16} className="animate-spin" />
                ) : compileStatus === 'success' ? (
                   <CheckCircle2 size={16} /> 
                ) : (
                   <LayoutTemplate size={16} /> 
                )}
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {isCompiling ? 'Compiling' : compileStatus === 'success' ? 'Good to go' : 'Compile'}
                </span>
             </button>

             <button 
                onClick={handleAutoLayout}
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-neutral-700 transition-colors text-xs font-medium text-gray-300 ml-2"
                title="Auto-arrange nodes"
             >
                <LayoutTemplate size={14} />
                <span>Re-Layout</span>
             </button>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Parent Class Link (UE5 Style) */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium">
               <span className="text-neutral-500">Parent Class:</span> 
               <span className="text-[#4da6ff] hover:underline cursor-pointer">{targetClass}</span>
            </div>

            <div className="text-xs text-neutral-500 font-mono">v1.0.0</div>
            <button 
              onClick={() => setShowSettings(true)}
              className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 text-neutral-400 hover:text-white hover:border-white/30 transition-all"
              title="Settings & API Key"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT SIDEBAR (My Blueprint) */}
          <div className="w-64 bg-[#111] border-r border-black flex flex-col z-20">
            <div className="p-2 border-b border-white/5 bg-[#1a1a1a]">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">My Blueprint</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Variables Section */}
              <div className="mb-1">
                 <div className="flex items-center justify-between px-3 py-1 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer group">
                    <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                       <span className="text-neutral-500 text-[10px]">▼</span> Variables
                    </span>
                    <button onClick={handleAddVariable} className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white">
                       <Plus size={12} />
                    </button>
                 </div>
                 <div className="flex flex-col">
                    {variables.map(v => (
                       <div key={v.id} className="flex items-center gap-2 px-6 py-1 hover:bg-[#0070e0] hover:text-white cursor-pointer group text-gray-400 text-xs">
                          {/* Type Pill */}
                          <div className={`w-2 h-1 rounded-full 
                             ${v.type === PinType.Boolean ? 'bg-red-500' : ''}
                             ${v.type === PinType.Integer ? 'bg-emerald-400' : ''}
                             ${v.type === PinType.Float ? 'bg-green-400' : ''}
                             ${v.type === PinType.String ? 'bg-pink-500' : ''}
                          `}></div>
                          <span>{v.name}</span>
                       </div>
                    ))}
                    {variables.length === 0 && <div className="px-6 py-1 text-[10px] text-neutral-600 italic">No variables</div>}
                 </div>
              </div>

              {/* Functions Section */}
              <div className="mt-1">
                 <div className="flex items-center justify-between px-3 py-1 bg-neutral-800/50 hover:bg-neutral-800 cursor-pointer group">
                    <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                       <span className="text-neutral-500 text-[10px]">▼</span> Functions
                    </span>
                    <button onClick={handleAddFunction} className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white">
                       <Plus size={12} />
                    </button>
                 </div>
                 <div className="flex flex-col">
                    {functions.map(f => (
                       <div key={f.id} className="flex items-center gap-2 px-6 py-1 hover:bg-[#0070e0] hover:text-white cursor-pointer group text-gray-400 text-xs">
                          <div className="text-blue-400 font-serif italic text-[10px]">f</div>
                          <span>{f.name}</span>
                       </div>
                    ))}
                    {functions.length === 0 && <div className="px-6 py-1 text-[10px] text-neutral-600 italic">No functions</div>}
                 </div>
              </div>
            </div>

            {/* AI Prompt Section */}
            <div className="p-3 border-t border-black bg-[#151515]">
               <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                   <Zap size={12} className="text-yellow-500" />
                   AI Assistant
                 </label>
                 <div 
                   className="flex items-center gap-1 cursor-pointer" 
                   onClick={() => setVerboseMode(!verboseMode)}
                   title="Toggle Verbose Logging"
                 >
                   <span className={`text-[10px] ${verboseMode ? 'text-blue-400' : 'text-gray-600'}`}>Verbose</span>
                   {verboseMode ? <ToggleRight size={16} className="text-blue-500" /> : <ToggleLeft size={16} className="text-gray-600" />}
                 </div>
               </div>
               
               <form onSubmit={handleGenerate} className="flex flex-col gap-2">
                 <textarea
                   ref={textareaRef}
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="e.g. When the player steps on the trigger, toggle the light and play a sound..."
                   className="w-full bg-[#0a0a0a] border border-neutral-700 rounded p-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 resize-none overflow-hidden min-h-[60px]"
                   rows={3}
                   disabled={loading}
                 />
                 <button
                   type="submit"
                   disabled={loading || !prompt.trim()}
                   className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded py-1 text-xs font-semibold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 h-8"
                 >
                   {loading && !verboseMode ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} fill="white" />}
                   {loading ? (verboseMode ? 'Generating...' : 'Thinking...') : 'Generate Logic'}
                 </button>
                 <button
                   type="button"
                   onClick={handleLoadSampleGraph}
                   className="w-full border border-dashed border-neutral-600 hover:border-blue-500 text-neutral-400 hover:text-white rounded py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors h-8"
                 >
                   Load Sample Graph (no AI)
                 </button>
               </form>

               {error && (
                 <div className="mt-2 p-2 bg-red-900/20 border border-red-900/50 rounded flex items-start gap-2">
                   <XCircle size={12} className="text-red-500 mt-0.5" />
                   <p className="text-[10px] text-red-300 leading-tight">{error}</p>
                 </div>
               )}
            </div>
          </div>

          {/* MAIN CANVAS CONTAINER */}
          <div className="flex-1 relative bg-[#0f0f0f]">
            
            {/* VIEW TOGGLE (Blueprint / Split / C++) */}
            <div className="absolute top-4 right-4 z-40 flex bg-black/80 backdrop-blur p-1 rounded-full border border-white/10 shadow-xl">
               <button 
                 onClick={() => setViewMode('blueprint')}
                 title="Blueprint Only"
                 className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2
                   ${viewMode === 'blueprint' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                 `}
               >
                 <Cpu size={14} />
                 <span className="hidden sm:inline">Blueprint</span>
               </button>
               <button 
                 onClick={() => setViewMode('split')}
                 title="Split View"
                 className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2
                   ${viewMode === 'split' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                 `}
               >
                 <Columns size={14} />
                 <span className="hidden sm:inline">Split</span>
               </button>
               <button 
                 onClick={() => setViewMode('cpp')}
                 title="C++ Only"
                 className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2
                   ${viewMode === 'cpp' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5'}
                 `}
               >
                 <FileCode size={14} />
                 <span className="hidden sm:inline">C++</span>
               </button>
            </div>

            {/* UE5 BACKGROUND WATERMARK */}
            {viewMode === 'blueprint' && (
               <div className="absolute bottom-0 right-0 p-8 pointer-events-none select-none z-0 overflow-hidden opacity-20">
                  <span className="text-[100px] font-semibold text-[#ffffff] tracking-tighter leading-none opacity-10">
                    BLUEPRINT
                  </span>
               </div>
            )}

            {/* Layout Rendering Logic */}
            {viewMode === 'blueprint' && (
              <BlueprintCanvas 
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onReconnect={onReconnect}
                onReconnectStart={onReconnectStart}
                onReconnectEnd={onReconnectEnd}
                onEdgeClick={onEdgeClick}
                onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                onPaneClick={() => setSelectedNodeId(null)}
              />
            )}

            {viewMode === 'cpp' && renderCppView()}

            {viewMode === 'split' && (
                <div className="flex w-full h-full">
                    {/* Left Pane: Blueprint (50%) */}
                    <div className="w-1/2 h-full border-r border-neutral-800 relative">
                        <BlueprintCanvas 
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            onEdgeClick={onEdgeClick}
                            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                            onPaneClick={() => setSelectedNodeId(null)}
                        />
                    </div>
                    {/* Right Pane: C++ (50%) */}
                    <div className="w-1/2 h-full">
                        {renderCppView()}
                    </div>
                </div>
            )}
            
            {/* Loading Overlay (Non-Verbose only) */}
            {loading && !verboseMode && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-neutral-700 shadow-2xl flex flex-col items-center max-w-sm text-center">
                  <div className="relative mb-4">
                     <div className="absolute inset-0 animate-ping opacity-20 bg-blue-500 rounded-full"></div>
                     <Loader2 size={40} className="text-blue-500 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Constructing Logic</h3>
                  <p className="text-xs text-neutral-400">Consulting UE5 Documentation & Building Graph...</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (Details) - Only if selected */}
          {selectedNode && viewMode !== 'cpp' && (
            <div className="w-64 bg-[#111] border-l border-black flex flex-col z-20">
               <div className="p-2 border-b border-white/5 bg-[#1a1a1a]">
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Details</span>
               </div>
               <div className="p-3 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] text-gray-500 uppercase font-semibold">Node Name</label>
                     <input 
                       type="text" 
                       value={selectedNode.data.label} 
                       onChange={(e) => {
                          setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n));
                       }}
                       className="bg-[#0a0a0a] border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                     />
                  </div>
                  <div className="flex flex-col gap-1">
                     <label className="text-[10px] text-gray-500 uppercase font-semibold">Comment</label>
                     <textarea 
                       value={selectedNode.data.comment || ''}
                       onChange={(e) => {
                          setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, comment: e.target.value } } : n));
                       }}
                       className="bg-[#0a0a0a] border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500 min-h-[60px]"
                     />
                  </div>
                  <div className="p-2 bg-neutral-800 rounded border border-neutral-700">
                     <div className="text-[10px] text-neutral-400 font-mono mb-1">ID: {selectedNode.id}</div>
                     <div className="text-[10px] text-neutral-400 font-mono">Type: {selectedNode.data.nodeType}</div>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* BOTTOM PANEL (Output Log / Compiler Results) */}
        <div className={`border-t border-black bg-[#111] transition-all duration-300 flex flex-col ${showOutputLog ? 'h-48' : 'h-8'}`}>
          <div 
             className="h-8 bg-[#1a1a1a] flex items-center justify-between px-4 cursor-pointer hover:bg-[#222]"
             onClick={() => setShowOutputLog(!showOutputLog)}
          >
             <div className="flex items-center gap-2">
                <Terminal size={14} className="text-neutral-400" />
                <span className="text-xs font-semibold text-gray-300">Output Log</span>
                {logs.length > 0 && <span className="bg-neutral-700 text-[10px] px-1.5 rounded-full text-neutral-300">{logs.length}</span>}
             </div>
             {showOutputLog ? <div className="text-xs text-neutral-500">▼</div> : <div className="text-xs text-neutral-500">▲</div>}
          </div>
          
          {showOutputLog && (
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] custom-scrollbar bg-[#0f0f0f]">
               {logs.length === 0 && (
                  <div className="text-neutral-600 italic p-2">No logs available. Generate logic or compile to see output.</div>
               )}
               {logs.map((log) => (
                  <div key={log.id} className="flex gap-2 mb-0.5 hover:bg-white/5 px-1 rounded">
                     <span className="text-neutral-500 select-none">[{log.timestamp}]</span>
                     <span className={`
                        ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                        ${log.type === 'warning' ? 'text-yellow-500' : ''}
                        ${log.type === 'success' ? 'text-green-500' : ''}
                        ${log.type === 'verbose' ? 'text-neutral-500' : 'text-gray-300'}
                     `}>
                        {log.type === 'error' && 'LogBlueprint: Error: '}
                        {log.type === 'warning' && 'LogBlueprint: Warning: '}
                        {log.message}
                     </span>
                  </div>
               ))}
               <div ref={logEndRef} /> {/* Scroll Anchor */}
               {blueprintSummary && !loading && (
                 <div className="mt-4 pt-2 border-t border-neutral-800">
                    <div className="text-blue-400 font-bold mb-1">Blueprint Summary:</div>
                    <div className="text-gray-400 leading-relaxed max-w-3xl whitespace-pre-wrap">{blueprintSummary}</div>
                    
                    {blueprintSources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                         {blueprintSources.map((src, i) => (
                            <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-neutral-500 hover:text-blue-400 transition-colors bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                               <BookOpen size={10} />
                               <span>{src.title}</span>
                               <ExternalLink size={10} />
                            </a>
                         ))}
                      </div>
                    )}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
