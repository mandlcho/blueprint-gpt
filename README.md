# blueprint-gpt : llm-to-blueprint code generator.

**License:** Apache 2.0 — free to use, modify, and ship (including commercially) with attribution retained. Originated by Mandl Cho (GitHub: [@mandlcho](https://github.com/mandlcho) · LinkedIn: [mandlcho](https://www.linkedin.com/in/mandlcho/)). See `LICENSE` and `NOTICE` for details.

Logic creation using blueprints made easy.

## Demo

<img src="media/2025-11-23/blueprint-demo.gif" alt="blueprint-gpt demo" style="max-width: 960px; width: 100%; border: 1px solid #ddd; border-radius: 8px;" />

## Live LLM setup

- Copy `blueprint-vibe/.env.example` to `.env.local` (kept out of git) and set whichever keys you have: `GEMINI_API_KEY` for Google AI Studio, `OPENAI_API_KEY`/`CODEX_API_KEY` for OpenAI GPT or Codex.
- Alternatively, open the app, click **Settings** (top-right), paste your keys, and choose the provider (Gemini, OpenAI, or Auto). Auto prefers Gemini when both exist, and falls back to OpenAI if not.
- Keys are read at runtime, so you can flip providers without rebuilding.

## Roadmap

- See `ROADMAP.md` for details.
- Highlights: web-based interface->standalone app->packaged UE plugin (.uplugin).

## License and attribution

- Licensed under Apache 2.0. You can use, learn from, modify, and ship it (including commercially) as long as you keep the required notices.
- Originator: Mandl Cho (GitHub: [@mandlcho](https://github.com/mandlcho) · LinkedIn: [mandlcho](https://www.linkedin.com/in/mandlcho/)). Please retain this attribution in forks and redistributions.
- Contributions are welcome and will be released under the same license; submit PRs to be listed as a contributor.
- Friendly ask: if you use this, drop me a message and let me know what you’re building.
