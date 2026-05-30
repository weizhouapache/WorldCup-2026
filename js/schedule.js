import { fetchJson, formatKickoff, getDefaultTimezone, timezoneOptions } from './common.js';

const STORAGE_KEY = 'worldcup-2026-selected-teams';
const SAVED_FILTERS_KEY = 'worldcup-2026-saved-filters';
const MAX_SAVED_FILTERS = 10;
const STORAGE_CHECK_KEY = '__wc26-storage-check__';
const storage = resolveStorage();

const timezoneSelect = document.querySelector('#timezone');
const teamFilterEl = document.querySelector('#team-filter');
const scheduleEl = document.querySelector('#schedule');
const clearSelectedEl = document.querySelector('#clear-selected');
const savedFiltersListEl = document.querySelector('#saved-filters-list');
const filterNameEl = document.querySelector('#filter-name');
const saveFilterBtn = document.querySelector('#save-filter');

let timezone = getDefaultTimezone();
let selectedTeams = new Set(loadTeams());
let matches = [];
let filtersInitialized = false;

init().catch((error) => {
  scheduleEl.textContent = `Unable to load schedule: ${error.message}`;
});

async function init() {
  const schedule = await fetchJson('./data/schedule.json');
  matches = [...schedule.matches].sort((a, b) => new Date(a.utcKickoff) - new Date(b.utcKickoff));

  setupTimezone();
  setupFilters();
  setupClearSelectedControl();
  setupSavedFilters();
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
  if (filtersInitialized) {
    return;
  }

  teamFilterEl.innerHTML = '';
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
      saveTeams();
      renderSchedule();
    });

    label.append(checkbox, ` ${team}`);
    teamFilterEl.append(label);
  }
  filtersInitialized = true;
}

function setupClearSelectedControl() {
  clearSelectedEl?.addEventListener('change', () => {
    if (!clearSelectedEl.checked) {
      return;
    }

    selectedTeams.clear();
    saveTeams();

    for (const checkbox of teamFilterEl.querySelectorAll('input[type="checkbox"]')) {
      checkbox.checked = false;
    }

    clearSelectedEl.checked = false;
    renderSchedule();
  });
}

function renderSchedule() {
  scheduleEl.innerHTML = '';

  const filtered = matches.filter((match) => {
    if (selectedTeams.size === 0) {
      return true;
    }

    return selectedTeams.has(match.homeTeam) || selectedTeams.has(match.awayTeam);
  });

  const now = Date.now();
  const withKickoffTime = filtered.map((match) => ({ match, kickoffTime: new Date(match.utcKickoff).getTime() }));
  const upcoming = withKickoffTime.filter(({ kickoffTime }) => kickoffTime >= now).map(({ match }) => match);
  const past = withKickoffTime.filter(({ kickoffTime }) => kickoffTime < now).map(({ match }) => match).reverse();

  scheduleEl.append(
    renderSection('Upcoming matches', upcoming, 'No upcoming matches for the selected filters.'),
    renderSection('Past matches', past, 'No past matches for the selected filters.')
  );
}

function renderSection(title, sectionMatches, emptyMessage) {
  const section = document.createElement('section');
  section.className = 'schedule-group';

  const heading = document.createElement('h3');
  heading.textContent = title;
  section.append(heading);

  if (sectionMatches.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'meta';
    emptyState.textContent = emptyMessage;
    section.append(emptyState);
    return section;
  }

  for (const match of sectionMatches) {
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
    section.append(article);
  }

  return section;
}

function saveTeams() {
  storage?.setItem(STORAGE_KEY, JSON.stringify([...selectedTeams]));
}

function loadTeams() {
  try {
    const parsed = JSON.parse(storage?.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Saved filters ────────────────────────────────────────────────────────────

function loadSavedFilters() {
  try {
    const parsed = JSON.parse(storage?.getItem(SAVED_FILTERS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSavedFilters(filters) {
  storage?.setItem(SAVED_FILTERS_KEY, JSON.stringify(filters));
}

function setupSavedFilters() {
  renderSavedFilters();

  saveFilterBtn?.addEventListener('click', () => {
    const name = filterNameEl?.value.trim();
    if (!name) {
      filterNameEl?.focus();
      return;
    }

    const filters = loadSavedFilters();
    if (filters.length >= MAX_SAVED_FILTERS) {
      alert(`You can save at most ${MAX_SAVED_FILTERS} filters. Please remove one first.`);
      return;
    }

    filters.push({ name, teams: [...selectedTeams] });
    persistSavedFilters(filters);
    if (filterNameEl) filterNameEl.value = '';
    renderSavedFilters();
  });
}

function renderSavedFilters() {
  if (!savedFiltersListEl) return;
  savedFiltersListEl.innerHTML = '';

  const filters = loadSavedFilters();
  if (filters.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'saved-filters-empty';
    empty.textContent = 'No saved filters yet.';
    savedFiltersListEl.append(empty);
    return;
  }

  for (let i = 0; i < filters.length; i++) {
    const index = i;
    const { name, teams } = filters[i];

    const pill = document.createElement('span');
    pill.className = 'saved-filter-pill';

    const loadBtn = document.createElement('button');
    loadBtn.className = 'saved-filter-load';
    loadBtn.textContent = name;
    loadBtn.title = `Load filter: ${name}`;
    loadBtn.addEventListener('click', () => {
      selectedTeams = new Set(teams);
      saveTeams();
      for (const checkbox of teamFilterEl.querySelectorAll('input[type="checkbox"]')) {
        checkbox.checked = selectedTeams.has(checkbox.value);
      }
      renderSchedule();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'saved-filter-remove';
    removeBtn.textContent = '×';
    removeBtn.title = `Remove filter: ${name}`;
    removeBtn.addEventListener('click', () => {
      const current = loadSavedFilters();
      current.splice(index, 1);
      persistSavedFilters(current);
      renderSavedFilters();
    });

    pill.append(loadBtn, removeBtn);
    savedFiltersListEl.append(pill);
  }
}

function resolveStorage() {
  try {
    localStorage.setItem(STORAGE_CHECK_KEY, '1');
    localStorage.removeItem(STORAGE_CHECK_KEY);
    return localStorage;
  } catch {}

  try {
    sessionStorage.setItem(STORAGE_CHECK_KEY, '1');
    sessionStorage.removeItem(STORAGE_CHECK_KEY);
    return sessionStorage;
  } catch {}

  return null;
}
