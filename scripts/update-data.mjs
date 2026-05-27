import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sources = {
  schedule: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures',
  standings: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings',
  knockout: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/bracket'
};

const now = new Date().toISOString();

await mkdir('data/raw', { recursive: true });

for (const [name, url] of Object.entries(sources)) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'worldcup-2026-tracker-bot' } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    await writeFile(`data/raw/${name}.html`, html);

    const jsonPath = `data/${name}.json`;
    let current = {};
    try {
      current = JSON.parse(await readFile(jsonPath, 'utf8'));
    } catch {
      current = {};
    }
    current.updatedAt = now;
    current.source = url;
    await writeFile(jsonPath, `${JSON.stringify(current, null, 2)}\n`);
  } catch (error) {
    console.warn(`Skipping ${name}: ${error.message}`);
  }
}

await refreshTeamsFromSchedule(now, sources.schedule);

async function refreshTeamsFromSchedule(updatedAt, source) {
  try {
    const schedule = JSON.parse(await readFile('data/schedule.json', 'utf8'));
    const matches = Array.isArray(schedule.matches) ? schedule.matches : [];
    const teams = [...new Set(matches.flatMap((match) => [match.homeTeam, match.awayTeam]))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    const teamsPayload = {
      updatedAt,
      source,
      teams
    };

    await writeFile('data/teams.json', `${JSON.stringify(teamsPayload, null, 2)}\n`);
  } catch (error) {
    console.warn(`Skipping teams: ${error.message}`);
  }
}
