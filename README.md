# blueprint-gpt

Generate, preview, and edit Unreal Engine Blueprint graphs in the browser.

This repo combines:
- a web-based Blueprint viewer/editor (UE-like interactions),
- a natural-language → Blueprint text generator (Claude API in-browser),
- and data tooling/scrapers for Blueprint node metadata from UE docs.

## Problem

Blueprint iteration has friction:
- translating intent into node graphs is time-consuming,
- sharing logic often requires screenshots rather than editable artifacts,
- and node metadata (inputs/outputs/categories) is fragmented across docs.

blueprint-gpt aims to shorten the loop: describe intent → generate Blueprint text → preview/edit visually → copy/export into UE.

## Who it’s for

- Unreal developers who prototype gameplay logic in Blueprints
- Tool builders who want a browser-based Blueprint visualization component
- Anyone experimenting with LLM-assisted Blueprint authoring

## Goals

- Turn natural language prompts into valid Blueprint text snippets
- Provide a faithful, interactive graph editor UX in the browser
- Maintain a usable node dataset for better prompting/search/spawning

## Success metrics

- Generation success: outputs paste into UE with minimal manual repair
- UX success: common node graph edits are discoverable and keyboard-friendly
- Time-to-first-result: open the page and see a generated graph in < 2 minutes
- Data completeness: node dataset covers the majority of commonly used Blueprint nodes

## What’s included

### Web app (static)
- `index.html` — main entry; includes viewer/editor and generator UI
- `dist/uebblueprint*.js` — blueprint rendering engine
- `dist/generator-v2.js` — generator client (Claude API call from browser)

### Generator
- Uses Anthropic Messages API (`https://api.anthropic.com/v1/messages`)
- Stores API key in `localStorage` under `blueprint_api_key`
- Has demo mode behavior when no API key is present (returns built-in example graphs)

### Interaction features
See `INTERACTIVE_FEATURES.md`. Highlights:
- Tab/right-click node search menu
- Drag to connect pins, Alt-click to delete links
- Delete to remove nodes, drag to reposition

### Data tooling
Scripts for building/inspecting datasets:
- UE docs scrapers (see `SCRAPER_README.md`)
- JSON merges and category inspection tools
- Reference datasets in `ue_blueprint_nodes*.json`

## Scope

- Static web UI + blueprint graph rendering/editing
- LLM prompt → Blueprint text generation
- Node metadata scraping and dataset maintenance

## Non-goals

- Shipping a full packaged UE plugin today (that’s a later milestone)
- Guaranteed correctness for every generated graph (LLM outputs vary)
- Replacing UE’s Blueprint editor for production work

## Constraints / assumptions

- In-browser calling of Anthropic API requires `anthropic-dangerous-direct-browser-access: true`
  - treat API keys carefully; this is intended for personal use/prototyping
- Generated Blueprint text must match UE’s text export/import conventions
- UE docs scraping is rate-limited/protected; scraping is multi-phase and resumable

## How to run

### Option A — simplest: open locally
Open `index.html` in a modern browser.

If your browser blocks some module/file behaviors, use a local server.

### Option B — local server
From repo root:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/

## Using the generator (Claude)

1. Open the page
2. Enter your Anthropic API key when prompted (stored in `localStorage` as `blueprint_api_key`)
3. Type a natural language request (e.g. “Find distance between player and enemy”)
4. The page renders the resulting graph; you can edit and then copy/export

If no API key is present, the app falls back to demo graphs for testing.

## Roadmap

- Add a validation report panel (node count, pin link integrity, missing metadata)
- Add export formats (download `.txt` and clipboard helpers)
- Improve node search with dataset-backed pin-type compatibility filtering
- Package targets: web interface → standalone app → UE plugin (.uplugin)
