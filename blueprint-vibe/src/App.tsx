import "ueblueprint/dist/css/ueb-style.min.css";
import "ueblueprint/dist/ueblueprint.js";
import { createElement } from "react";
import { SAMPLE_BLUEPRINT } from "./sampleBlueprint";

type BlueprintProps = {
  blueprintHtml: string;
};

function BlueprintViewer({ blueprintHtml }: BlueprintProps) {
  return createElement(
    "ueb-blueprint",
    null,
    createElement("template", { dangerouslySetInnerHTML: { __html: blueprintHtml } })
  );
}

function App() {
  return (
    <code>
      <BlueprintViewer blueprintHtml={SAMPLE_BLUEPRINT} />
    </code>
  );
}

export default App;
