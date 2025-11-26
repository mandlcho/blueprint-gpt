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
  return (
    <code>
      <ueb-blueprint>
        <template dangerouslySetInnerHTML={{ __html: SAMPLE_BLUEPRINT }} />
      </ueb-blueprint>
    </code>
  );
}

export default App;
