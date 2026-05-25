import { fetchJson, formatKickoff, getDefaultTimezone } from './common.js';

const knockoutEl = document.querySelector('#knockout');
const timezone = getDefaultTimezone();

init().catch((error) => {
  knockoutEl.textContent = `Unable to load knockout stages: ${error.message}`;
});

async function init() {
  const data = await fetchJson('./data/knockout.json');

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
