import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import {
  instantiateBlueprintPlan,
  BlueprintNodePlan,
  BlueprintEdgePlan
} from "../ue/nodeFactory";
import {
  sanitizeModelJson,
  buildSystemInstruction
} from "../services/generationUtils";

interface CliOptions {
  prompt?: string;
  file?: string;
  out?: string;
  verbose?: boolean;
}

const parseArgs = (): CliOptions => {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case "--prompt":
      case "-p":
        options.prompt = args[i + 1];
        i += 1;
        break;
      case "--file":
      case "-f":
        options.file = args[i + 1];
        i += 1;
        break;
      case "--out":
      case "-o":
        options.out = args[i + 1];
        i += 1;
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      default:
        break;
    }
  }

  return options;
};

const resolvePrompt = (opts: CliOptions): string => {
  if (opts.prompt) {
    return opts.prompt;
  }
  if (opts.file) {
    const absolute = path.isAbsolute(opts.file)
      ? opts.file
      : path.join(process.cwd(), opts.file);
    return fs.readFileSync(absolute, "utf8");
  }
  throw new Error(
    "Provide a prompt via --prompt \"...\" or --file path/to/prompt.txt"
  );
};

const ensureApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error(
      "Set GEMINI_API_KEY (or API_KEY) in your environment before running this test."
    );
  }
  return apiKey;
};

const prettyPrintPlan = (nodePlan: BlueprintNodePlan[], edgePlan: BlueprintEdgePlan[]) => {
  console.log(`\nNodes (${nodePlan.length}):`);
  nodePlan.forEach((node) => {
    console.log(`  • ${node.id} -> ${node.nodeKey}`);
  });
  console.log(`\nEdges (${edgePlan.length}):`);
  edgePlan.forEach((edge) => {
    console.log(
      `  • ${edge.source.node}:${edge.source.pin} -> ${edge.target.node}:${edge.target.pin}`
    );
  });
};

const run = async () => {
  const options = parseArgs();
  const prompt = resolvePrompt(options);
  const apiKey = ensureApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: buildSystemInstruction(),
      temperature: 0.1
    }
  });

  const parsed = sanitizeModelJson(response.text || "");
  const nodePlan = (parsed.nodePlan || []) as BlueprintNodePlan[];
  const edgePlan = (parsed.edges || []) as BlueprintEdgePlan[];

  const { nodes, edges } = instantiateBlueprintPlan(nodePlan, edgePlan);

  console.log("AI Assistant Test Result");
  console.log("=========================");
  console.log(`Target Class: ${parsed.targetClass || "BP_GeneratedActor"}`);
  console.log(`Nodes: ${nodes.length} | Edges: ${edges.length}`);
  console.log(`Summary:\n${parsed.summary || "No summary provided."}`);

  if (options.verbose) {
    prettyPrintPlan(nodePlan, edgePlan);
  }

  if (options.out) {
    const outputPath = path.isAbsolute(options.out)
      ? options.out
      : path.join(process.cwd(), options.out);
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          nodePlan,
          edgePlan,
          blueprint: {
            nodes,
            edges,
            summary: parsed.summary,
            cppCode: parsed.cppCode,
            targetClass: parsed.targetClass
          }
        },
        null,
        2
      )
    );
    console.log(`\nSaved full blueprint plan to ${outputPath}`);
  }
};

run().catch((error) => {
  console.error("AI Assistant test failed:", error.message);
  process.exit(1);
});
