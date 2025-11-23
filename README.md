# blueprint-gpt : llm-to-blueprint code generator.

**License:** Apache 2.0 — free to use, modify, and ship (including commercially) with attribution retained. Originated by Mandl Cho (GitHub: [@mandlcho](https://github.com/mandlcho)). See `LICENSE` and `NOTICE` for details.

A UE5 editor plugin that lets you "vibe code" blueprint snippets by describing the desired feature in natural language. It currently sends prompts to the Gemini API and injects the structured answer back into your Blueprint graph as an annotated comment block so you can wire things up quickly. Future updates will add other LLM APIs behind the same interface. The repo and plugin folder are both named **blueprint-gpt**, so you can drop it straight into a project.

## Features

- Editor-only module that adds a Blueprint-exposed async node `Send Prompt` for use inside Editor Utility Widgets or Blutilities.
- CLI-style dockable window (Window → blueprint-gpt) so you can vibe code directly from a tab without wiring Blueprints first.
- Project Settings panel (`Plugins > blueprint-gpt`) for storing your Gemini API key, base URL, model, temperature and default system instructions. Other LLM providers will plug into the same panel later.
- Optional auto-drop of the returned plan into the selected Blueprint as a comment (pseudo-K2 text + implementation notes).
- JSON-centric prompting so models respond with deterministic payloads you can parse or extend.

## Quick start

1. Copy the `blueprint-gpt` folder into your project's `Plugins` directory (create it if missing).
2. Regenerate project files and rebuild the editor module.
3. Launch the editor, open **Project Settings → Plugins → blueprint-gpt** and paste your Gemini API key.
4. Open the blueprint-gpt console tab (Window → blueprint-gpt), paste your Blueprint asset path/prompt, then hit **Send Prompt** to chat in a terminal-style UI. Toggle “Drop comment into Blueprint” if you want notes injected automatically.
5. (Optional) Create an **Editor Utility Widget** (or Blutility) and call `Send Prompt` from the `VibeCode` category if you prefer to wire the async node yourself.
6. Every response yields an `FVibeCodePlan` struct (Summary + PseudoK2 + Notes). If `bApplySuggestion` is true, a comment node containing the plan is injected into the Blueprint you referenced.

### Blueprint snippet example

```blueprint
Vibe Code → Send Prompt
  Prompt: "When the player presses Interact, open the terminal widget if it's not visible"
  Context.BlueprintPath: "/Game/Blueprints/BP_PlayerController.BP_PlayerController"
  Options.bApplySuggestion: true
```

You can display the `OnSuccess` struct in a multi-line text box, or render Notes in the widget for quick copy/paste.

## Response schema

The system prompt enforces the following payload so you can add more automation later (e.g., auto-spawning nodes instead of comments):

```json
{
  "summary": "Short description of what the snippet does",
  "pseudoK2": "Indented pseudo-nodes describing execution flow",
  "notes": ["Array of optional bullet points"]
}
```

Feel free to extend `FVibeCodePlan` with more structured data (variables, pins, dependencies) and ask the LLM to fill them.

## Limitations / ideas

- The CLI window still injects comment nodes; replacing that with actual K2 nodes would require a richer response schema.
- Credentials live in plain-text config; prefer env overrides if you ship broadly.

## Development

The code lives in `Source/blueprint-gpt`. Key classes:

- `UVibeCodeSettings`: Developer settings for API credentials.
- `UVibeCodeAsyncAction`: Blueprint async node hitting the Chat Completions endpoint via `FVibeCodePromptService`.
- `SVibeCodeConsole`: Slate widget that provides the Codex-style window/tab experience.
- `UVibeCodeEditorSubsystem`: Helper that injects the pseudo-code into the target Blueprint as a comment node.

You can extend the subsystem to spawn real nodes using `UEdGraphSchema_K2::SpawnNodeFromTemplate` once you define a reliable JSON schema for nodes/pins.

## License and attribution

- Licensed under Apache 2.0. You can use, learn from, modify, and ship it (including commercially) as long as you keep the required notices.
- Originator: Mandl Cho (GitHub: [@mandlcho](https://github.com/mandlcho)). Please retain this attribution in forks and redistributions.
- Contributions are welcome and will be released under the same license; submit PRs to be listed as a contributor.
- Friendly ask: if you use this, drop me a message and let me know what you’re building.
