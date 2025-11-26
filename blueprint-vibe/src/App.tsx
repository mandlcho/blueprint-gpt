import { useEffect, useRef } from "react";
import "ueblueprint/dist/css/ueb-style.min.css";
import "ueblueprint/dist/ueblueprint.js";
import { SAMPLE_BLUEPRINT } from "./sampleBlueprint";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "ueb-blueprint": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function App() {
  const blueprintRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = blueprintRef.current;
    if (!el) return;

    const mount = async () => {
      if (typeof customElements?.whenDefined === "function") {
        await customElements.whenDefined("ueb-blueprint");
      }
      el.innerHTML = `<template>\n${SAMPLE_BLUEPRINT}\n</template>`;
    };

    mount();
  }, []);

  return (
    <div className="app-root">
      <code>
        <ueb-blueprint ref={blueprintRef}></ueb-blueprint>
      </code>
    </div>
  );
}

export default App;
