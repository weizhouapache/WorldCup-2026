import { fetchJson, formatKickoff, getDefaultTimezone } from './common.js';

const knockoutEl = document.querySelector('#knockout');
const timezone = getDefaultTimezone();

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
      matchupCell.textContent = `${fixture.id.toUpperCase()}: ${fixture.homeTeam} vs ${fixture.awayTeam}`;

      const pathCell = document.createElement('td');
      const paths = references.get(fixture.id) ?? [];
      pathCell.textContent = paths.length > 0 ? paths.join(' · ') : fixture.id === 'final' ? 'Champion decided' : 'Eliminated';

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
        const match = side.match(/^(Winner|Loser)\s+([A-Z0-9-]+)$/i);
        if (!match) continue;

        const sourceFixtureId = match[2].toLowerCase();
        const path = `${capitalize(match[1])} → ${fixture.id.toUpperCase()} (${round.name})`;
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
