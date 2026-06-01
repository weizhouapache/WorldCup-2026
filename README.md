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

## PR previews

Every pull request is automatically deployed to a temporary Surge.sh URL:

```
https://worldcup-2026-pr-<PR_NUMBER>.surge.sh
```

A comment is posted on the PR with the preview link and updated on every push. The deployment is torn down when the PR is closed.

**Required secret:** Add a `SURGE_TOKEN` secret to the repository (Settings → Secrets and variables → Actions). Generate a token by running `npx surge token` locally after creating a free [Surge.sh](https://surge.sh) account.
