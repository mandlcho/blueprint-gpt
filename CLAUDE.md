# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**blueprint-gpt** is an LLM-to-blueprint code generator that enables easy logic creation using Unreal Engine blueprints. The project provides a web-based interface for parsing and visualizing Unreal Engine Blueprint data.

**License:** Apache 2.0 with attribution requirements. Originated by Mandl Cho (GitHub: @mandlcho, LinkedIn: mandlcho).

## Repository Structure

This is a **static web application** repository:
- `index.html` - Main HTML page that embeds UE Blueprint viewer
- `dist/` - Production build output
  - `ueblueprint.js` - Main JavaScript bundle (readable version)
  - `ueblueprint.min.js` - Minified production bundle
  - `css/` - Stylesheets (includes `ueb-style.min.css`)
  - `font/` - Font assets
- `media/` - Demo assets (gifs, screenshots)
- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow

**Note:** This repository contains the compiled/built files in `dist/`. There is no source code, build tooling (package.json, webpack, etc.), or development workflow present. The project appears to be in a **distribution-only state** - only the final compiled assets and demo page are included.

## Architecture

### Blueprint Viewer Component

The `dist/ueblueprint.js` file contains a custom web component `<ueb-blueprint>` built with Lit Element (v4.1.1) that:
- Parses Unreal Engine Blueprint node syntax embedded in `<template>` tags
- Renders interactive blueprint graphs in the browser
- Handles node connections, pins, and visual styling
- Uses a grid-based layout system (16px grid with 8-set spacing)

### Blueprint Data Format

Blueprint nodes are defined in UE's `Begin Object...End Object` format within the `<template>` element:
- Nodes include metadata: Class, NodePos, NodeGuid, pins, connections
- Pin connections are defined via `LinkedTo` references using GUIDs
- Supports various node types: K2Node_FunctionEntry, K2Node_VariableGet, K2Node_CallFunction, K2Node_Knot

### Key Configuration Constants (in ueblueprint.js)

- `Configuration.VERSION` - Currently "2.0.0"
- `Configuration.gridSize` - 16px base grid unit
- `Configuration.nodeColors` - Predefined node color palette (blue, red, green, etc.)
- Node styling uses RGB CSS custom properties for theming
- Link rendering uses Bezier curves with configurable height/width

## Common Development Tasks

Since there is no build system present in this repository, typical development would involve:

### Viewing the Demo Locally

Open `index.html` in a web browser to see the blueprint visualization. The page:
1. Imports the Blueprint component from `dist/ueblueprint.js`
2. Loads CSS from `dist/css/ueb-style.min.css`
3. Renders blueprint nodes defined in the `<template>` tag

### GitHub Pages Deployment

The `.github/workflows/deploy.yml` workflow references a `blueprint-vibe` subdirectory that is not present in the current repository state. This workflow appears to be outdated - it expects:
- A `blueprint-vibe/` directory with Node.js project (`package.json`, `package-lock.json`)
- NPM build scripts (`npm ci`, `npm run build`)
- Build output in `blueprint-vibe/dist/`

**Current deployment approach:** The repository should deploy `index.html` and `dist/` directly to GitHub Pages, not build from source.

## Understanding Blueprint Nodes

When working with blueprint data in the `<template>` section:

1. **Node Classes** indicate the node type:
   - `K2Node_FunctionEntry` - Function entry point nodes
   - `K2Node_CallFunction` - Function call nodes
   - `K2Node_VariableGet` - Variable getter nodes
   - `K2Node_Knot` - Reroute/knot nodes for wire management

2. **Node Positioning** uses `NodePosX` and `NodePosY` coordinates in pixels

3. **Pin Connections** use `LinkedTo` arrays with format:
   ```
   LinkedTo=(NodeName PinGuid,)
   ```

4. **Pin Types** include categories: exec (execution), object (references), real (numbers), struct (data structures), bool

## Project Roadmap Reference

The README mentions a roadmap with progression:
- Web-based interface (current state)
- Standalone app (future)
- Packaged UE plugin (.uplugin) (future)

See `ROADMAP.md` for details (if it exists in future commits).

## Important Notes

- **This repository contains only compiled assets** - there is no source code for the `ueblueprint.js` library
- The blueprint viewer is a **read-only visualization tool** - it displays UE Blueprint data but doesn't edit or generate it
- Blueprint node syntax must match Unreal Engine's serialization format exactly
- Attribution to Mandl Cho must be retained per Apache 2.0 license requirements
