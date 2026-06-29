import { readFile, writeFile } from 'node:fs/promises';

const FIFA_API = 'https://api.fifa.com/api/v3/calendar/matches?language=en&count=200&idSeason=285023&idCompetition=17';
const now = new Date().toISOString();

const response = await fetch(FIFA_API, {
  headers: { 'user-agent': 'worldcup-2026-tracker-bot' }
});
if (!response.ok) throw new Error(`HTTP ${response.status}`);

const data = await response.json();
const matches = data.Results || [];

const getName = (obj) => obj?.TeamName?.[0]?.Description ?? null;

// ── Update schedule.json ────────────────────────────────────────────────────
const schedule = JSON.parse(await readFile('data/schedule.json', 'utf8'));
const apiById = {};
for (const m of matches) apiById[m.IdMatch] = m;

let scoreUpdates = 0;
for (const fix of schedule.matches) {
  const matchId = fix.link?.replace(/\/$/, '').split('/').pop();
  const am = matchId ? apiById[matchId] : null;
  if (!am) continue;
  const hs = am.HomeTeamScore, as = am.AwayTeamScore;
  if (hs != null && as != null) {
    const score = `${hs}-${as}`;
    if (fix.score !== score) { fix.score = score; scoreUpdates++; }
  }
}
schedule.updatedAt = now;
await writeFile('data/schedule.json', JSON.stringify(schedule, null, 2) + '\n');
console.log(`schedule.json: ${scoreUpdates} score(s) updated`);

// ── Compute standings from group stage ───────────────────────────────────────
const groups = {};
for (const m of matches) {
  if (m.StageName?.[0]?.Description !== 'First Stage') continue;
  const gn = m.GroupName?.[0]?.Description;
  if (!gn) continue;
  const home = getName(m.Home), away = getName(m.Away);
  const hs = m.HomeTeamScore, as = m.AwayTeamScore;
  if (hs == null || as == null || m.MatchStatus !== 0) continue;

  groups[gn] = groups[gn] || {};
  for (const [t, gf, ga] of [[home, hs, as], [away, as, hs]]) {
    const s = groups[gn][t] = groups[gn][t] || { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
    s.played++; s.gf += gf; s.ga += ga;
    if (gf > ga) { s.won++; s.pts += 3; }
    else if (gf === ga) { s.drawn++; s.pts += 1; }
    else { s.lost++; }
  }
}

const standingsData = { updatedAt: now, source: schedule.source, groups: [] };
const groupOrder = ['Group A','Group B','Group C','Group D','Group E','Group F',
  'Group G','Group H','Group I','Group J','Group K','Group L'];
for (const gn of groupOrder) {
  const teams = groups[gn];
  if (!teams) continue;
  const sorted = Object.entries(teams).sort((a, b) =>
    b[1].pts - a[1].pts || (b[1].gf - b[1].ga) - (a[1].gf - a[1].ga) || b[1].gf - a[1].gf);
  standingsData.groups.push({
    name: gn.replace('Group ', ''),
    teams: sorted.map(([name, s]) => ({
      name, played: s.played, won: s.won, drawn: s.drawn, lost: s.lost,
      goalsFor: s.gf, goalsAgainst: s.ga, goalDifference: s.gf - s.ga, points: s.pts
    }))
  });
}
await writeFile('data/standings.json', JSON.stringify(standingsData, null, 2) + '\n');
console.log('standings.json: updated');

// ── Update knockout.json ─────────────────────────────────────────────────────
const knockout = JSON.parse(await readFile('data/knockout.json', 'utf8'));
let koUpdates = 0;
for (const round of knockout.rounds) {
  for (const fix of round.fixtures) {
    const matchId = fix.link?.replace(/\/$/, '').split('/').pop();
    const am = matchId ? apiById[matchId] : null;
    if (!am) continue;

    // Score
    const hs = am.HomeTeamScore, as = am.AwayTeamScore;
    if (hs != null && as != null) {
      const score = `${hs}-${as}`;
      if (fix.score !== score) { fix.score = score; koUpdates++; }
    }

    // Winner (team name derived from Winner ID — handles penalties)
    const winnerId = am.Winner;
    if (winnerId) {
      const homeId = am.Home?.IdTeam, awayId = am.Away?.IdTeam;
      const winnerName = winnerId === homeId ? getName(am.Home) : winnerId === awayId ? getName(am.Away) : null;
      if (winnerName && fix.winner !== winnerName) { fix.winner = winnerName; koUpdates++; }
    }

    // Penalty score
    const hps = am.HomeTeamPenaltyScore, aps = am.AwayTeamPenaltyScore;
    if (hps != null && aps != null) {
      const pen = `${hps}-${aps}`;
      if (fix.penalty !== pen) { fix.penalty = pen; koUpdates++; }
    }
  }
}
knockout.updatedAt = now;
await writeFile('data/knockout.json', JSON.stringify(knockout, null, 2) + '\n');
console.log(`knockout.json: ${koUpdates} field(s) updated`);
console.log('Done.');
