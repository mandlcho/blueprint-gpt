import { GoogleGenAI } from "@google/genai";
import { GeneratedBlueprint } from "../types";
import {
  instantiateBlueprintPlan,
  BlueprintNodePlan,
  BlueprintEdgePlan
} from "../ue/nodeFactory";
import { buildSystemInstruction, sanitizeModelJson } from "./generationUtils";

export const generateBlueprint = async (
  prompt: string
): Promise<GeneratedBlueprint> => {
  const apiKey =
    localStorage.getItem("BLUEPRINT_VIBE_GEMINI_KEY") ||
    localStorage.getItem("BLUEPRINT_VIBE_API_KEY") ||
    localStorage.getItem("BLUEPRINT_VIBE_OPENAI_KEY") ||
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing API key. Open Settings (top right) and enter a Gemini key (or any key) in one of the API key fields."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = buildSystemInstruction();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.1
      }
    });

    const parsed = sanitizeModelJson(response.text || "");

    const nodePlan = (parsed.nodePlan || []) as BlueprintNodePlan[];
    const edgePlan = (parsed.edges || []) as BlueprintEdgePlan[];

    const { nodes, edges } = instantiateBlueprintPlan(nodePlan, edgePlan);

    return {
      nodes,
      edges,
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
    const isQuota =
      rawMessage.toLowerCase().includes("quota") ||
      rawMessage.includes("RESOURCE_EXHAUSTED") ||
      rawMessage.includes("429");
    const friendlyMessage = isQuota
      ? "Gemini quota exceeded for this API key. Add your own key in Settings (top right) or try again later."
      : "Gemini API failed. Check that your API key (from either field) is valid and has quota.";

    const normalized = new Error(friendlyMessage);
    (normalized as any).cause = error;
    throw normalized;
  }
};
