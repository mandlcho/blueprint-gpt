import { GoogleGenAI } from "@google/genai";
import { GeneratedBlueprint, BPNode, BPEdge } from "../types";

// Helper to inject missing pins for standard nodes if the AI forgets them
const ensureDefaultPins = (node: any) => {
  const label = node.label || "";
  const type = node.nodeType;
  
  if (!node.inputs) node.inputs = [];
  if (!node.outputs) node.outputs = [];

  // 1. BRANCH / IF
  if (label === "Branch" || label === "If") {
     // Ensure Exec In
     if (!node.inputs.some((p:any) => p.type === 'exec')) {
        node.inputs.unshift({ id: `${node.id}_Exec`, name: "Exec", type: 'exec' });
     }
     // Ensure Condition
     if (!node.inputs.some((p:any) => p.type === 'boolean')) {
        node.inputs.push({ id: `${node.id}_Condition`, name: "Condition", type: 'boolean' });
     }
     // Ensure True/False Out
     if (!node.outputs.some((p:any) => p.name === 'True')) {
        node.outputs.push({ id: `${node.id}_True`, name: "True", type: 'exec' });
     }
     if (!node.outputs.some((p:any) => p.name === 'False')) {
        node.outputs.push({ id: `${node.id}_False`, name: "False", type: 'exec' });
     }
     return node;
  }

  // 2. EVENTS (BeginPlay, Tick, Custom)
  if (type === 'event' || label.startsWith('Event') || label.startsWith('On ') || label.startsWith('Input')) {
     if (!node.outputs.some((p:any) => p.type === 'exec')) {
         node.outputs.unshift({ id: `${node.id}_Output`, name: "Output", type: 'exec' });
     }
     return node;
  }

  // 3. SEQUENCE
  if (label === "Sequence") {
     if (!node.inputs.some((p:any) => p.type === 'exec')) {
         node.inputs.unshift({ id: `${node.id}_Exec`, name: "Exec", type: 'exec' });
     }
     if (node.outputs.length < 2) {
         node.outputs.push({ id: `${node.id}_Then0`, name: "Then 0", type: 'exec' });
         node.outputs.push({ id: `${node.id}_Then1`, name: "Then 1", type: 'exec' });
     }
     return node;
  }

  // 4. SET VARIABLE
  if (type === 'variable_set' || label.startsWith('Set ')) {
      if (!node.inputs.some((p:any) => p.type === 'exec')) {
          node.inputs.unshift({ id: `${node.id}_Exec`, name: "Exec", type: 'exec' });
      }
      // Usually the second input is the value, AI might name it differently
      // We ensure there is at least one Exec out
      if (!node.outputs.some((p:any) => p.type === 'exec')) {
          node.outputs.unshift({ id: `${node.id}_Output`, name: "Output", type: 'exec' });
      }
      return node;
  }

  // 5. GET VARIABLE (Must have output)
  if (type === 'variable_get') {
      // Fix common LLM error: putting the pin in inputs instead of outputs
      if (node.inputs.length > 0 && node.outputs.length === 0) {
          node.outputs = [...node.inputs];
          node.inputs = [];
      }
      if (node.outputs.length === 0) {
          // Guess type based on label or default to boolean
          node.outputs.push({ id: `${node.id}_Value`, name: "Value", type: 'boolean' });
      }
      return node;
  }

  // 6. FOR LOOP
  if (label === "For Loop" || label === "ForEach Loop") {
      if (!node.inputs.some((p:any) => p.type === 'exec')) {
          node.inputs.unshift({ id: `${node.id}_Exec`, name: "Exec", type: 'exec' });
      }
      if (!node.outputs.some((p:any) => p.name === 'Loop Body')) {
          node.outputs.push({ id: `${node.id}_LoopBody`, name: "Loop Body", type: 'exec' });
      }
      if (!node.outputs.some((p:any) => p.name === 'Completed')) {
          node.outputs.push({ id: `${node.id}_Completed`, name: "Completed", type: 'exec' });
      }
      return node;
  }

  // 7. GENERIC FUNCTION / MACRO FALLBACK
  // If it's a generic node (Function, Flow Control) and NOT a variable getter, ensuring it has Exec pins helps connectivity.
  const isPure = type === 'variable_get';
  if (!isPure && type !== 'comment') {
      // Ensure Input Exec
      if (!node.inputs.some((p:any) => p.type === 'exec')) {
          node.inputs.unshift({ id: `${node.id}_Exec`, name: "Exec", type: 'exec' });
      }
      // Ensure Output Exec (Unless it's a known terminal node, but safe to add)
      if (!node.outputs.some((p:any) => p.type === 'exec')) {
          node.outputs.unshift({ id: `${node.id}_Output`, name: "Output", type: 'exec' });
      }
  }

  return node;
};

export const generateBlueprint = async (prompt: string): Promise<GeneratedBlueprint> => {
  // PRIORITY: Check LocalStorage (New Key Name) -> Check LocalStorage (Old Key Name) -> Check Env Var
  const apiKey = localStorage.getItem("BLUEPRINT_VIBE_GEMINI_KEY") || 
                 localStorage.getItem("BLUEPRINT_VIBE_API_KEY") ||
                 localStorage.getItem("BLUEPRINT_VIBE_OPENAI_KEY") ||
                 process.env.GEMINI_API_KEY ||
                 process.env.API_KEY;
  
  if (!apiKey) {
      throw new Error("Missing API key. Open Settings (top right) and enter a Gemini key (or any key) in one of the API key fields.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Unreal Engine 5.3 C++ Gameplay Programmer and Blueprint Architect.
    
    **CRITICAL C++ COMPLIANCE INSTRUCTIONS (STRICT)**:
    1.  **COMPILER SIMULATION**: Verify that every class, function, and macro exists in the Unreal Engine 5.3 API.
    2.  **HEADER MANDATE**: You MUST include the specific headers for every class used (e.g., "Components/CapsuleComponent.h").
    3.  **CONTEXT**: Code is within 'AGeneratedActor'. Use 'GetWorld()', 'GetActorLocation()' correctly.
    4.  **NAMING**: Booleans 'bIsActive', Classes 'U', Actors 'A', Enums 'E'.
    5.  **NO HALLUCINATIONS**: Do not invent functions. If unsure, use generic standard library functions.

    **STANDARD NODE LIBRARY (VISUAL GRAPH)**:
    - "event": Red header. (BeginPlay, Tick, OnHit)
    - "function": Blue header (Green if pure).
    - "flow_control": Gray header. (Branch, Sequence, ForLoop)
    - "variable_get": Compact pill.
    - "variable_set": Standard node with "SET" header.

    **STRICT JSON OUTPUT RULES**:
    1. Output MUST be valid JSON.
    2. **ALL Keys MUST be enclosed in double quotes** (e.g., "nodes": ..., NOT nodes: ...).
    3. All string values MUST be double-quoted.
    4. **NO Trailing commas**.
    5. **NO Comments** inside the JSON structure (comments inside string values like "cppCode" are allowed).
    6. **NO Markdown** code blocks.

    **CRITICAL EDGE GENERATION RULES**:
    1. **PIN IDs MUST BE EXPLICIT**: Every input and output pin MUST have a unique 'id' field. 
       - Convention: "{NodeID}_{PinName}" (e.g., "Branch1_True", "Event1_Output").
    2. **EDGES MUST MATCH PIN IDs**: The 'sourceHandle' of an edge MUST match an 'id' in the source node's 'outputs'. The 'targetHandle' MUST match an 'id' in the target node's 'inputs'.
    3. If these IDs do not match exactly, the link will be invisible.

    **COMMON MISTAKES TO AVOID**:
    - For "Branch", you MUST include outputs "True" and "False".
    - For "Sequence", you MUST include outputs "Then 0", "Then 1", etc.
    - For "Variable Set", you MUST include an Exec input and an Exec output.

    **JSON STRUCTURE EXAMPLE (Connected Logic)**:
    {
      "nodes": [
        { 
          "id": "Event1", 
          "label": "Event BeginPlay", 
          "nodeType": "event", 
          "inputs": [], 
          "outputs": [{"id":"Event1_ExecOut","name":"Output","type":"exec"}] 
        }
      ],
      "edges": [],
      "variables": [],
      "functions": [],
      "targetClass": "BP_PlayerCharacter",
      "cppCode": "#include \"GeneratedActor.h\"\\n// Code...",
      "summary": "- Logic step 1\\n- Logic step 2"
    }

    **TARGET CLASS IDENTIFICATION**:
    Identify the most appropriate Blueprint Class name for this logic based on the user's request.
    - If logic implies a player, use "BP_Player" or "BP_Character".
    - If logic implies an enemy, use "BP_Enemy".
    - If generic, use "BP_GeneratedActor".
    - Field: "targetClass".
  `;

  try {
    // Use gemini-3-pro-preview for complex coding and strict JSON adherence
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.1, 
      }
    });

    let result = response.text || "";
    
    // 1. Remove markdown
    result = result.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // 2. Extract the main JSON object
    const firstBrace = result.indexOf('{');
    const lastBrace = result.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      result = result.substring(firstBrace, lastBrace + 1);
    } else {
      throw new Error("No JSON object found in response");
    }

    // 3. Sanitize:
    // - Remove non-printable control characters (0x00-0x1F) except \n (0x0A), \r (0x0D), \t (0x09)
    result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    let parsed: any;
    
    try {
      parsed = JSON.parse(result);
    } catch (e) {
      console.warn("Initial parse failed, attempting to fix trailing commas...");
      // Fix trailing commas: Replace ", }" with "}" and ", ]" with "]"
      result = result.replace(/,(\s*[}\]])/g, '$1');
      try {
        parsed = JSON.parse(result);
      } catch (e2) {
         // If it still fails, throw detailed error for debugging output
         throw new Error(`JSON Parse Failed: ${(e2 as Error).message}. Snippet: ${result.substring(0, 50)}...`);
      }
    }
    
    // Transform flat JSON nodes to valid React Flow nodes with 'data' container
    const transformedNodes: BPNode[] = (parsed.nodes || []).map((node: any) => {
      // INJECT MISSING PINS
      const enrichedNode = ensureDefaultPins(node);

      return {
        id: enrichedNode.id,
        type: 'customBlueprintNode',
        position: { x: 0, y: 0 }, // Default, will be layouted
        data: {
            label: enrichedNode.label,
            nodeType: enrichedNode.nodeType,
            inputs: enrichedNode.inputs || [],
            outputs: enrichedNode.outputs || [],
            comment: enrichedNode.comment
        }
      };
    });

    // Edge Healing and Validation
    // Sometimes LLMs hallucinate handle IDs. We attempt to fix them here.
    const validEdges: BPEdge[] = (parsed.edges || []).map((edge: any, index: number) => {
        const sourceNode = transformedNodes.find(n => n.id === edge.source);
        const targetNode = transformedNodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        let finalSourceHandle = edge.sourceHandle;
        let finalTargetHandle = edge.targetHandle;

        // Verify Source Handle
        // Safe lower case check
        const sourceHandleStr = finalSourceHandle ? String(finalSourceHandle).toLowerCase() : "";
        const sourcePinExists = finalSourceHandle && sourceNode.data.outputs.some(p => p.id === finalSourceHandle);
        
        if (!sourcePinExists) {
            // HEALING: If explicit ID fails, or is missing, look for a matching Type.
            const isExecLike = !finalSourceHandle || sourceHandleStr.includes('exec') || sourceHandleStr.includes('then') || sourceHandleStr.includes('true') || sourceHandleStr.includes('out');
            
            if (isExecLike) {
                 // Try to find the first EXEC pin
                 const execPin = sourceNode.data.outputs.find(p => p.type === 'exec');
                 if (execPin) finalSourceHandle = execPin.id;
                 else if (sourceNode.data.outputs.length > 0) finalSourceHandle = sourceNode.data.outputs[0].id;
            } else {
                 // Just take the first one available if we can't guess type
                 if (sourceNode.data.outputs.length > 0) {
                     finalSourceHandle = sourceNode.data.outputs[0].id;
                 }
            }
        }

        // Verify Target Handle
        const targetHandleStr = finalTargetHandle ? String(finalTargetHandle).toLowerCase() : "";
        const targetPinExists = finalTargetHandle && targetNode.data.inputs.some(p => p.id === finalTargetHandle);
        
        if (!targetPinExists) {
            // HEALING
             const isExecLike = !finalTargetHandle || targetHandleStr.includes('exec');
             if (isExecLike) {
                 const execPin = targetNode.data.inputs.find(p => p.type === 'exec');
                 if (execPin) finalTargetHandle = execPin.id;
                 else if (targetNode.data.inputs.length > 0) finalTargetHandle = targetNode.data.inputs[0].id;
             } else {
                 if (targetNode.data.inputs.length > 0) {
                     finalTargetHandle = targetNode.data.inputs[0].id;
                 }
             }
        }

        // Generate a unique ID if missing
        const edgeId = edge.id || `e_${edge.source}_${edge.target}_${index}`;

        // If we still don't have handles (node has no pins?), we can't draw the edge.
        if (!finalSourceHandle || !finalTargetHandle) return null;

        return {
            id: edgeId,
            source: edge.source,
            target: edge.target,
            sourceHandle: finalSourceHandle,
            targetHandle: finalTargetHandle,
            type: 'default',
            animated: false
        };
    }).filter((e: BPEdge | null) => e !== null);

    return {
        nodes: transformedNodes,
        edges: validEdges,
        summary: parsed.summary || "No summary provided.",
        cppCode: parsed.cppCode || "// No C++ code generated.",
        targetClass: parsed.targetClass || "BP_GeneratedActor",
        variables: parsed.variables || [],
        functions: parsed.functions || [],
        sources: parsed.sources || []
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    const rawMessage = error?.message || "";
    const isQuota = rawMessage.toLowerCase().includes("quota") || rawMessage.includes("RESOURCE_EXHAUSTED") || rawMessage.includes("429");
    const friendlyMessage = isQuota
      ? "Gemini quota exceeded for this API key. Add your own key in Settings (top right) or try again later."
      : "Gemini API failed. Check that your API key (from either field) is valid and has quota.";

    const normalized = new Error(friendlyMessage);
    (normalized as any).cause = error;
    throw normalized;
  }
};
