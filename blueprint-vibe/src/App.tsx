import { useMemo, useState } from "react";
import { BlueprintCanvas } from "./components/BlueprintCanvas";
import type { BlueprintEdge, BlueprintNode } from "./types";
import { instantiateBlueprintPlan } from "./ue/nodeFactory";
import type { BlueprintEdgePlan, BlueprintNodePlan } from "./ue/nodeFactory";
import { UE_NODE_KEYS } from "./ue/nodeCatalog";

const SAMPLE_NODE_PLAN: BlueprintNodePlan[] = [
  {
    id: "CustomEvent_Entry",
    nodeKey: "CustomEvent",
    comment: "Entry point",
    labelOverride: "Custom Event",
  },
  {
    id: "Branch",
    nodeKey: "Branch",
  },
  {
    id: "Print",
    nodeKey: "PrintString",
    pinValues: {
      InString: "Hello from blueprint-vibe!",
    },
  },
];

const SAMPLE_EDGE_PLAN: BlueprintEdgePlan[] = [
  {
    source: { node: "CustomEvent_Entry", pin: "then" },
    target: { node: "Branch", pin: "execute" },
  },
  {
    source: { node: "Branch", pin: "then" },
    target: { node: "Print", pin: "execute" },
  },
];

const createSampleGraph = () => instantiateBlueprintPlan(SAMPLE_NODE_PLAN, SAMPLE_EDGE_PLAN);

function App() {
  const [graph, setGraph] = useState<{ nodes: BlueprintNode[]; edges: BlueprintEdge[] }>(() =>
    createSampleGraph()
  );
  const [notes, setNotes] = useState("Sketch out a blueprint prompt or paste clipboard data...");

  const catalogSize = UE_NODE_KEYS.length;

  const stats = useMemo(
    () => ({
      nodes: graph.nodes.length,
      edges: graph.edges.length,
    }),
    [graph]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      <header className="border-b border-white/10 bg-black/50 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400">blueprint-vibe</p>
            <h1 className="text-2xl font-semibold text-white">UE Blueprint playground</h1>
            <p className="text-sm text-gray-400">
              Powered by barsdeveloper/ueblueprint assets, node catalog, and styling.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGraph(createSampleGraph())}
              className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500"
            >
              Load Sample Graph
            </button>
            <a
              href="https://github.com/barsdeveloper/ueblueprint"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              Reference Repo
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[2fr,1fr]">
        <section className="min-h-[480px] overflow-hidden rounded-xl border border-white/5 bg-black/30 shadow-lg">
          <BlueprintCanvas nodes={graph.nodes} edges={graph.edges} />
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 h-32 w-full resize-none rounded border border-white/10 bg-black/40 p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Drop ideas here while mirroring UE nodes. Nodes available: {catalogSize} derived from the official tests.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-gray-200">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">Graph Stats</h2>
            <dl className="mt-3 space-y-1">
              <div className="flex justify-between">
                <dt>Nodes</dt>
                <dd className="font-semibold text-white">{stats.nodes}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Edges</dt>
                <dd className="font-semibold text-white">{stats.edges}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Node Catalog</dt>
                <dd className="font-semibold text-white">{catalogSize}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-gray-500">
              Node metadata extracted from barsdeveloper/ueblueprint via scripts/buildNodeCatalog.mjs.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
