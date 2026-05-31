import { fetchJson } from './common.js';
import { t, initI18n } from './i18n.js';

const standingsEl = document.querySelector('#standings');

init().catch((error) => {
  standingsEl.textContent = t('load_error_standings', error.message);
});

async function init() {
  const data = await fetchJson('./data/standings.json');

  initI18n();

  for (const group of data.groups) {
    const card = document.createElement('section');
    card.className = 'table-card';

    const title = document.createElement('h3');
    title.textContent = t('group_label', group.name);

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>${t('col_team')}</th>
          <th>${t('col_played')}</th>
          <th>${t('col_won')}</th>
          <th>${t('col_drawn')}</th>
          <th>${t('col_lost')}</th>
          <th>${t('col_gf')}</th>
          <th>${t('col_ga')}</th>
          <th>${t('col_pts')}</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    const sortedRows = [...group.teams].sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);

    for (const team of sortedRows) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${team.name}</td>
        <td>${team.played}</td>
        <td>${team.won}</td>
        <td>${team.drawn}</td>
        <td>${team.lost}</td>
        <td>${team.goalsFor}</td>
        <td>${team.goalsAgainst}</td>
        <td>${team.points}</td>
      `;
      tbody.append(row);
    }

    card.append(title, table);
    standingsEl.append(card);
  }
}
