# UnrealVibes · Vibe Code plugin

A UE5 editor plugin that lets you "vibe code" blueprint snippets by describing the desired feature in natural language. It sends prompts to OpenAI's Chat Completions API and injects the structured answer back into your Blueprint graph as an annotated comment block so you can wire things up quickly. The repo and plugin folder are both named **UnrealVibes**, so you can drop it straight into a project.

## Features

- Editor-only module that adds a Blueprint-exposed async node `Send Prompt` for use inside Editor Utility Widgets or Blutilities.
- CLI-style `unreal-cli` window (Window → unrealvibes → unreal-cli) so you can vibe code directly from a dockable tab without wiring Blueprints first.
- Project Settings panel (`Plugins > Vibe Code`) for storing your ChatGPT token, base URL, model, temperature and default system instructions.
- Optional auto-drop of the returned plan into the selected Blueprint as a comment (pseudo-K2 text + implementation notes).
- JSON-centric prompting so models respond with deterministic payloads you can parse or extend.

## Quick start

1. Copy the `UnrealVibes` folder into your project's `Plugins` directory (create it if missing).
2. Regenerate project files and rebuild the editor module.
3. Launch the editor, open **Project Settings → Plugins → Vibe Code** and paste your ChatGPT token (Plus or Free-tier).
4. Open **Window → unrealvibes → unreal-cli**, paste your Blueprint asset path/prompt, then hit **Send Prompt** to chat in a terminal-style UI. Toggle “Drop comment into Blueprint” if you want notes injected automatically.
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

Feel free to extend `FVibeCodePlan` with more structured data (variables, pins, dependencies) and ask ChatGPT to fill them.

## Limitations / ideas

- The CLI window still injects comment nodes; replacing that with actual K2 nodes would require a richer response schema.
- Credentials live in plain-text config; prefer env overrides if you ship broadly.

## Development

The code lives in `Source/UnrealVibes`. Key classes:

- `UVibeCodeSettings`: Developer settings for API credentials.
- `UVibeCodeAsyncAction`: Blueprint async node hitting the Chat Completions endpoint via `FVibeCodePromptService`.
- `SVibeCodeConsole`: Slate widget that provides the Codex-style window/tab experience.
- `UVibeCodeEditorSubsystem`: Helper that injects the pseudo-code into the target Blueprint as a comment node.

You can extend the subsystem to spawn real nodes using `UEdGraphSchema_K2::SpawnNodeFromTemplate` once you define a reliable JSON schema for nodes/pins.
