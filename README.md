# World Cup 2026 Tracker

Static website for FIFA World Cup 2026 schedule, standings, and knockout stages.

## Features

- Schedule page ordered by UTC kickoff time
- Timezone selector with browser timezone as default
- Multi-team filter persisted in localStorage
- Standings page
- Knockout stages page
- GitHub Actions workflow to refresh data from FIFA sources

## Local development

Open `index.html` in a browser, or serve the repository with any static file server.

## Data refresh

The workflow in `.github/workflows/update-data.yml` fetches FIFA schedule/results pages and updates generated JSON files.
