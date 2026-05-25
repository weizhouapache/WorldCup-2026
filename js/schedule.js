import { fetchJson, formatKickoff, getDefaultTimezone, timezoneOptions } from './common.js';

const STORAGE_KEY = 'worldcup-2026-selected-teams';

const timezoneSelect = document.querySelector('#timezone');
const teamFilterEl = document.querySelector('#team-filter');
const scheduleEl = document.querySelector('#schedule');

let timezone = getDefaultTimezone();
let selectedTeams = new Set(loadTeams());
let matches = [];

init().catch((error) => {
  scheduleEl.textContent = `Unable to load schedule: ${error.message}`;
});

async function init() {
  const schedule = await fetchJson('./data/schedule.json');
  matches = [...schedule.matches].sort((a, b) => new Date(a.utcKickoff) - new Date(b.utcKickoff));

  setupTimezone();
  setupFilters();
  renderSchedule();
}

function setupTimezone() {
  timezoneOptions(timezone).forEach((zone) => {
    const option = document.createElement('option');
    option.value = zone;
    option.textContent = zone;
    timezoneSelect.append(option);
  });

  timezoneSelect.value = timezone;
  timezoneSelect.addEventListener('change', () => {
    timezone = timezoneSelect.value;
    renderSchedule();
  });
}

function setupFilters() {
  const teams = [...new Set(matches.flatMap((match) => [match.homeTeam, match.awayTeam]))].sort();

  for (const team of teams) {
    const label = document.createElement('label');
    label.className = 'chip';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = team;
    checkbox.checked = selectedTeams.has(team);

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedTeams.add(team);
      } else {
        selectedTeams.delete(team);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedTeams]));
      renderSchedule();
    });

    label.append(checkbox, ` ${team}`);
    teamFilterEl.append(label);
  }
}

function renderSchedule() {
  scheduleEl.innerHTML = '';

  const filtered = matches.filter((match) => {
    if (selectedTeams.size === 0) {
      return true;
    }

    return selectedTeams.has(match.homeTeam) || selectedTeams.has(match.awayTeam);
  });

  if (filtered.length === 0) {
    scheduleEl.textContent = 'No matches found for the selected filters.';
    return;
  }

  for (const match of filtered) {
    const article = document.createElement('article');
    article.className = 'match-card';

    const teams = document.createElement('div');
    teams.textContent = `${match.homeTeam} vs ${match.awayTeam}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${formatKickoff(match.utcKickoff, timezone)} (${timezone}) · ${match.venue}`;

    const score = document.createElement('div');
    score.className = 'meta';
    score.textContent = match.score ?? 'TBD';

    article.append(teams, meta, score);
    scheduleEl.append(article);
  }
}

function loadTeams() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
