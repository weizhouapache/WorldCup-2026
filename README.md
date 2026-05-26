# World Cup 2026 Tracker

Static website for FIFA World Cup 2026 schedule, standings, and knockout stages.

## Features

- Schedule page ordered by UTC kickoff time
- Timezone selector with browser timezone as default
- Multi-team filter persisted in localStorage
- Standings page
- Knockout stages page
- GitHub Actions workflow to refresh data from FIFA sources

## Project structure

- `index.html` - schedule and filter UI
- `standings.html` - group standings tables
- `knockout.html` - knockout stage fixtures
- `data/*.json` - generated data consumed by pages
- `scripts/update-data.mjs` - data refresh script used in CI

## Local development

Open `index.html` directly in a browser, or run a static file server from the repository root.

## Data refresh

The workflow in `.github/workflows/update-data.yml` runs every 12 hours and on manual dispatch. It downloads FIFA source pages into `data/raw/` and updates metadata fields in generated JSON files.
