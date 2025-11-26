import { GoogleGenAI } from "@google/genai";
import { GeneratedBlueprint } from "../types";
import {
  instantiateBlueprintPlan,
  BlueprintNodePlan,
  BlueprintEdgePlan
} from "../ue/nodeFactory";
import { buildSystemInstruction, sanitizeModelJson } from "./generationUtils";

export type ProviderPreference = "auto" | "gemini" | "openai";
type ResolvedProvider = Exclude<ProviderPreference, "auto">;

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const resolveApiKeys = () => {
  const geminiKey =
    getLocalStorageItem("BLUEPRINT_VIBE_GEMINI_KEY") ||
    getLocalStorageItem("BLUEPRINT_VIBE_API_KEY") ||
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    null;

  const openAIKey =
    getLocalStorageItem("BLUEPRINT_VIBE_OPENAI_KEY") ||
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_KEY ||
    process.env.CODEX_API_KEY ||
    null;

  return { geminiKey, openAIKey };
};

const resolveProvider = (
  preference: ProviderPreference,
  keys: ReturnType<typeof resolveApiKeys>
): ResolvedProvider => {
  if (preference === "gemini") {
    return "gemini";
  }
  if (preference === "openai") {
    return "openai";
  }
  if (keys.geminiKey) {
    return "gemini";
  }
  if (keys.openAIKey) {
    return "openai";
  }
  return "gemini";
};

const normalizeBlueprintResult = (rawText: string): GeneratedBlueprint => {
  const parsed = sanitizeModelJson(rawText);
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
};

const extractOpenAIMessage = (content: any): string => {
  if (!content) {
    return "";
  }
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part) return "";
        if (typeof part === "string") return part;
        if (typeof part === "object" && "text" in part) {
          return part.text || "";
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof content === "object" && "text" in content) {
    return (content as { text?: string }).text || "";
  }
  return "";
};

const generateWithGemini = async (
  prompt: string,
  apiKey: string
): Promise<GeneratedBlueprint> => {
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

    return normalizeBlueprintResult(response.text || "");
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

const generateWithOpenAI = async (
  prompt: string,
  apiKey: string
): Promise<GeneratedBlueprint> => {
  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.1,
      messages: [
        { role: "system", content: buildSystemInstruction() },
        { role: "user", content: prompt }
      ]
    })
  });

  const json = await response.json();

  if (!response.ok) {
    const friendly =
      json?.error?.message ||
      json?.error?.code ||
      "OpenAI API failed. Confirm your key is valid and allowed to call chat completions.";
    throw new Error(friendly);
  }

  const choice = json?.choices?.[0]?.message?.content;
  const text = extractOpenAIMessage(choice);

  if (!text) {
    throw new Error("OpenAI API returned no content. Try again or adjust your prompt.");
  }

  return normalizeBlueprintResult(text);
};

export const generateBlueprint = async (
  prompt: string,
  providerPreference: ProviderPreference = "auto"
): Promise<GeneratedBlueprint> => {
  const keys = resolveApiKeys();
  const provider = resolveProvider(providerPreference, keys);

  if (provider === "gemini") {
    if (!keys.geminiKey) {
      throw new Error(
        "No Gemini key detected. Enter one in Settings or set GEMINI_API_KEY."
      );
    }
    return generateWithGemini(prompt, keys.geminiKey);
  }

  if (!keys.openAIKey) {
    throw new Error(
      "No OpenAI key detected. Enter a GPT/Codex key in Settings or set OPENAI_API_KEY."
    );
  }

  return generateWithOpenAI(prompt, keys.openAIKey);
};
