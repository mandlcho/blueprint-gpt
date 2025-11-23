import { UE_NODE_KEYS, UE_NODE_LIBRARY } from "../ue/nodeCatalog";

export const buildNodeLibrarySummary = (): string => {
  return UE_NODE_KEYS.map((key) => {
    const template = UE_NODE_LIBRARY[key];
    const pinSummary = template.pins
      .map(
        (pin) =>
          `${pin.direction === "input" ? "In" : "Out"} ${pin.name} (${pin.type})`
      )
      .join(", ");
    return `- ${key}: "${template.label}" (${template.nodeType}) Pins: ${pinSummary}`;
  }).join("\n");
};

export const buildSystemInstruction = (): string => `
You are an expert Unreal Engine 5.3 gameplay programmer.

STRICT BLUEPRINT PLAN OUTPUT
- Use only the following UE node templates: 
${buildNodeLibrarySummary()}
- Instead of inventing nodes, build a plan referencing these keys.
- Output JSON with the schema:
{
  "targetClass": "BP_Player",
  "cppCode": "#include ...",
  "summary": "- bullet point\\n- bullet point",
  "nodePlan": [
     { "id": "Event1", "nodeKey": "EventBeginPlay", "comment": "", "pinValues": {} }
  ],
  "edges": [
     { "source": { "node": "Event1", "pin": "Output" }, "target": { "node": "Print1", "pin": "Exec" } }
  ],
  "variables": [],
  "functions": [],
  "sources": []
}

RULES
1. nodePlan entries must reference only nodeKey values listed above.
2. Pin names in edges must match the catalog pin names exactly.
3. Provide pinValues only when overriding catalog defaults.
4. JSON must be valid. Double quotes only, no comments, no trailing commas, no Markdown fences.
5. Describe the same logic in cppCode using verified UE 5.3 APIs with correct includes.
`;

export const sanitizeModelJson = (raw: string) => {
  let result = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  const firstBrace = result.indexOf("{");
  const lastBrace = result.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    result = result.substring(firstBrace, lastBrace + 1);
  } else {
    throw new Error("No JSON object found in response");
  }

  result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  try {
    return JSON.parse(result);
  } catch (error) {
    result = result.replace(/,(\s*[}\]])/g, "$1");
    return JSON.parse(result);
  }
};
