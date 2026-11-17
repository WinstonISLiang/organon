# Organon

[Français](./README.md) · [English](./README.en.md) · [简体中文](./README.zh-CN.md)

Organon is a tool developed for the French Wikipedia's Biology WikiProject. It generates draft articles for taxa using data from external taxonomic databases such as GBIF, ITIS, WoRMS, Catalogue of Life, EOL, and NCBI.

## Architecture

- `organon/core/` — Data model, module registry, wikitext rendering engine, categorisation rules, and data for grammar and taxonomic ranks. This component is independent of the user interface.
- `organon/modules/` — One adapter per external database. `adapter.py` makes HTTP requests and parses responses. `module.py` implements the module logic and connects it to the registry.
- `organon/api/` — FastAPI backend with the `/api/v1` prefix. After you run `npm run build`, it also serves the built frontend (`web-app/dist/`) as static files. Toolforge deployment requires a single process for the API and the UI.
- `web-app/` — React frontend built with Vite. It communicates with the API over HTTP. See [the frontend README](./web-app/README.md) for local development instructions.

## API

Routes that call an external service require an OAuth session. The `/auth/login` flow sets the session cookie. These routes are rate-limited by IP address. See [`organon/api/rate_limit.py`](./organon/api/rate_limit.py). Local routes for catalogues, version information, and authentication are accessible without an existing session.

| Route | Purpose | Session required |
|---|---|---|
| `POST /generate`, `GET /generate?taxon=` | Generate a complete article draft | Yes |
| `POST /generate/stream` | Generate an article draft using Server-Sent Events, with one event per module | Yes |
| `GET /search?q=` | Fuzzy search by scientific name, common name, or QID | Yes |
| `POST /taxobox/refresh` | Update the taxobox using the bot account | Yes |
| `GET /commons-images?taxon=` | Suggest images from Wikimedia Commons | Yes |
| `POST /subtaxa-merge` | Merge subtaxa from multiple sources | Yes |
| `POST /update/diagnose`, `POST /update/export` | Identify differences between Wikidata and source databases, and export QuickStatements | Yes |
| `GET /modules`, `/domains`, `/sources`, `/version` | List catalogues and return version information | No |
| `GET /auth/login`, `/auth/callback`, `/auth/me`, `POST /auth/logout` | Wikimedia OAuth flow | No |
| `GET /healthz` (outside the API prefix) | Health check | No |

Organon has no command-line interface. Article generation requires an OAuth session that a command-line client cannot obtain, and the previous CLI duplicated the `GenerateOptions` settings manually.

## Development

To run the backend locally:

```bash
pip install -e ".[dev]"
ORGANON_DEV=1 uvicorn organon.api.app:app --port 8123
```

`ORGANON_DEV=1` simulates a session for local development only. For frontend setup, see [the frontend README](./web-app/README.md).

## Licence

Organon is licensed under GPL-3.0-or-later. See [`LICENSE`](./LICENSE).

## Reporting a bug

Report issues such as incorrect article drafts, module failures, or wikitext rendering errors on the [Organon discussion page for the Biology WikiProject](https://fr.wikipedia.org/wiki/Discussion_Projet:Biologie/Organon).
