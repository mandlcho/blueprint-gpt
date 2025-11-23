# Repository Guidelines

## Project Structure & Module Organization
The root holds repo-level docs (`README.md`, `ROADMAP.md`, licensing notices) and the Vite workspace in `blueprint-vibe/`. Inside that app: `App.tsx` owns layout/state orchestration, `components/` stores reusable UI (Canvas + node views), `services/` wraps external calls like `geminiService.ts`, `utils/` covers shared helpers such as the auto-layout engine, and `public/` hosts static assets consumed via Vite. Type definitions live in `types.ts`, while configuration files (`tsconfig.json`, `vite.config.ts`, `.env.example`) guide tooling and environment setup.

## Build, Test, and Development Commands
Run `cd blueprint-vibe && npm install` once per environment. `npm run dev` starts Vite with hot reload at `http://localhost:5173`. `npm run build` performs a production bundle plus TypeScript type-checking, and must be clean before opening a PR. `npm run preview` serves the built assets to verify production behavior locally.

## Coding Style & Naming Conventions
Use TypeScript and functional React components with hooks. Follow the existing two-space indentation, semicolons, and double quotes inside JSX attributes. Keep modules small and colocate logic: UI in `components/`, data/contracts in `types.ts`, side effects in `services/`. Name files in PascalCase for components (`BlueprintCanvas.tsx`) and camelCase for utilities (`autoLayout.ts`). Prefer named exports and leverage the `@/` path alias configured in `tsconfig.json` for cross-folder imports.

## Testing Guidelines
Automated tests are not yet wired up, so new contributions should either add Vitest + Testing Library coverage alongside the feature (e.g., `components/__tests__/BlueprintCanvas.test.tsx`) or describe manual verification steps in the PR. Mirror the production build by running `npm run build` before submission. You can also dry-run the AI generation pipeline locally via `cd blueprint-vibe && npm run ai:test -- --prompt "Describe your logic"` (set `GEMINI_API_KEY` first) to ensure the structured plan parses and renders correctly; document any edge cases (e.g., complex node graphs or Gemini quota failures) that were exercised.

## Commit & Pull Request Guidelines
Commit history shows short, imperative subjects (`Improve Gemini error messaging`), so continue that style and keep changes scoped. Each PR should include: summary of behavior, linked issue or roadmap item, screenshots/GIFs for UI updates (reuse the `media/` directory), and notes about environment variables (`GEMINI_API_KEY`) or migrations. Ensure `package-lock.json` stays in sync, and mention any follow-up tasks explicitly.

## Security & Configuration Tips
Create `.env.local` from `.env.example` and store sensitive keys like `GEMINI_API_KEY`; never commit the real file. Treat the Gemini quota/latency messaging in `geminiService.ts` as user-facing—log errors, but strip stack traces before shipping. Review `metadata.json` before committing to avoid leaking prototype identifiers, and sanitize any AI-generated blueprint code displayed in the UI (see `highlightCpp`).
