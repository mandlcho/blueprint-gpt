# blueprint-vibe

This workspace reboots the Blueprint playground while leaning directly on the official [barsdeveloper/ueblueprint](https://github.com/barsdeveloper/ueblueprint) project for assets, node definitions, and canvas behavior.

## What's inside?

- `ueblueprint` web component for accurate UE5 visuals (CSS + JS imported globally).
- A generated node catalog sourced from the upstream repo (`src/ue/nodeCatalog.generated.ts`).
- `BlueprintCanvas` that mirrors the demo implementation by pasting clipboard text into `<ueb-blueprint>`.
- Tailwind CSS for lightweight styling.

## Development

```bash
npm install
npm run nodes:generate   # optional: re-extract nodes after updating tmp_ueblueprint
npm run dev
```

To regenerate the node catalog:

1. `git clone https://github.com/barsdeveloper/ueblueprint tmp_ueblueprint` at the repo root.
2. Run `npm run nodes:generate` (from `blueprint-vibe/`).
3. Commit the updated `src/ue/nodeCatalog.generated.ts`.

## Production build

```
npm run build
npm run preview
```

## Notes

- The canvas renders whatever `buildUeClipboard` produces, so any future generator only needs to return nodes/edges matching `BlueprintNode` and `BlueprintEdge`.
- Tailwind lives entirely in `src/index.css`; no CDN usage.
- Fonts/scrollbars/styling aim to stay close to the UE aesthetic showcased in the upstream reference.
