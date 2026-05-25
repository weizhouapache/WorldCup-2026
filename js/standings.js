import { fetchJson } from './common.js';

const standingsEl = document.querySelector('#standings');

init().catch((error) => {
  standingsEl.textContent = `Unable to load standings: ${error.message}`;
});

async function init() {
  const data = await fetchJson('./data/standings.json');

  for (const group of data.groups) {
    const card = document.createElement('section');
    card.className = 'table-card';

    const title = document.createElement('h3');
    title.textContent = `Group ${group.name}`;

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>GF</th>
          <th>GA</th>
          <th>Pts</th>
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
