import { fetchJson, formatKickoff, getDefaultTimezone } from './common.js';

const knockoutEl = document.querySelector('#knockout');
const timezone = getDefaultTimezone();
const PROGRESSION_REF_PATTERN = /^(Winner|Loser)\s+([A-Z0-9-]+)$/i;

init().catch((error) => {
  knockoutEl.textContent = `Unable to load knockout stages: ${error.message}`;
});

async function init() {
  const data = await fetchJson('./data/knockout.json');
  knockoutEl.append(buildMatchupChart(data.rounds));

  for (const round of data.rounds) {
    const section = document.createElement('section');
    section.className = 'round';

    const title = document.createElement('h3');
    title.textContent = round.name;
    section.append(title);

    for (const fixture of round.fixtures) {
      const card = document.createElement('article');
      card.className = 'match-card';

      const teams = document.createElement('div');
      teams.textContent = `${fixture.homeTeam} vs ${fixture.awayTeam}`;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${formatKickoff(fixture.utcKickoff, timezone)} (${timezone}) · ${fixture.venue}`;

      const score = document.createElement('div');
      score.className = 'meta';
      score.textContent = fixture.score ?? 'TBD';

      card.append(teams, meta, score);
      section.append(card);
    }

    knockoutEl.append(section);
  }
}

function buildMatchupChart(rounds) {
  const section = document.createElement('section');
  section.className = 'matchup-chart';

  const title = document.createElement('h3');
  title.textContent = 'Matchup chart';
  section.append(title);

  const wrapper = document.createElement('div');
  wrapper.className = 'matchup-table-wrapper';

  const table = document.createElement('table');
  table.className = 'matchup-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Round</th>
        <th scope="col">Matchup</th>
        <th scope="col">Advances to</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  const references = buildReferenceMap(rounds);

  for (const round of rounds) {
    for (const fixture of round.fixtures) {
      const row = document.createElement('tr');

      const roundCell = document.createElement('td');
      roundCell.textContent = round.name;

      const matchupCell = document.createElement('td');
      matchupCell.textContent = `${formatFixtureId(fixture.id)}: ${fixture.homeTeam} vs ${fixture.awayTeam}`;

      const pathCell = document.createElement('td');
      const paths = references.get(fixture.id) ?? [];
      if (paths.length > 0) {
        pathCell.textContent = paths.join(' · ');
      } else if (fixture.id === 'final') {
        pathCell.textContent = 'Champion decided';
      } else {
        pathCell.textContent = 'Eliminated';
      }

      row.append(roundCell, matchupCell, pathCell);
      tbody.append(row);
    }
  }

  wrapper.append(table);
  section.append(wrapper);
  return section;
}

function buildReferenceMap(rounds) {
  const references = new Map();

  for (const round of rounds) {
    for (const fixture of round.fixtures) {
      for (const side of [fixture.homeTeam, fixture.awayTeam]) {
        const match = side.match(PROGRESSION_REF_PATTERN);
        if (!match) continue;

        const [, outcome, sourceFixtureRef] = match;
        const sourceFixtureId = sourceFixtureRef.toLowerCase();
        const path = `${capitalize(outcome)} → ${formatFixtureId(fixture.id)} (${round.name})`;
        const entries = references.get(sourceFixtureId) ?? [];
        entries.push(path);
        references.set(sourceFixtureId, entries);
      }
    }
  }

  return references;
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
}

function formatFixtureId(fixtureId) {
  return fixtureId.toUpperCase();
}
