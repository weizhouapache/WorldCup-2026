import { fetchJson, formatKickoff, getDefaultTimezone, timezoneOptions, timezoneLabel } from './common.js';
import { t, getLocale, initI18n, localizeContinent, localizeTeamName } from './i18n.js';

const STORAGE_KEY = 'worldcup-2026-selected-teams';
const SAVED_FILTERS_KEY = 'worldcup-2026-saved-filters';
const MAX_SAVED_FILTERS = 10;
const STORAGE_CHECK_KEY = '__wc26-storage-check__';
const storage = resolveStorage();

// Continent → teams (static mapping based on 2026 World Cup draw)
const CONTINENT_TEAMS = {
  Europe: [
    'Czechia', 'Bosnia and Herzegovina', 'Switzerland', 'Scotland', 'Türkiye',
    'Germany', 'Netherlands', 'Sweden', 'Belgium', 'Spain', 'France', 'Norway',
    'Austria', 'Portugal', 'England', 'Croatia'
  ],
  'South America': ['Brazil', 'Paraguay', 'Ecuador', 'Uruguay', 'Argentina', 'Colombia'],
  'North America': ['Mexico', 'Canada', 'Haiti', 'United States', 'Curaçao', 'Panama'],
  Africa: [
    'South Africa', 'Morocco', "Côte d'Ivoire", 'Tunisia', 'Egypt',
    'Senegal', 'Algeria', 'DR Congo', 'Ghana', 'Cabo Verde'
  ],
  Asia: ['South Korea', 'Qatar', 'Japan', 'IR Iran', 'Saudi Arabia', 'Iraq', 'Jordan', 'Uzbekistan', 'Australia'],
  Oceania: ['New Zealand']
};

const timezoneSelect = document.querySelector('#timezone');
const teamFilterEl = document.querySelector('#team-filter');
const scheduleEl = document.querySelector('#schedule');
const clearSelectedEl = document.querySelector('#clear-selected');
const savedFiltersListEl = document.querySelector('#saved-filters-list');
const filterNameEl = document.querySelector('#filter-name');
const saveFilterBtn = document.querySelector('#save-filter');
const predefinedGroupFiltersEl = document.querySelector('#predefined-group-filters');
const predefinedContinentFiltersEl = document.querySelector('#predefined-continent-filters');

let timezone = getDefaultTimezone();
let selectedTeams = new Set(loadTeams());
let matches = [];
let filtersInitialized = false;

init().catch((error) => {
  scheduleEl.textContent = t('load_error_schedule', error.message);
});

async function init() {
  const schedule = await fetchJson('./data/schedule.json');
  matches = [...schedule.matches].sort((a, b) => new Date(a.utcKickoff) - new Date(b.utcKickoff));

  initI18n();
  setupTimezone();
  setupPredefinedFilters();
  setupFilters();
  setupClearSelectedControl();
  setupSavedFilters();
  renderSchedule();
}

function setupTimezone() {
  const zones = timezoneOptions(timezone);
  if (!zones.includes(timezone)) {
    zones.push(timezone);
  }

  zones.forEach((zone) => {
    const option = document.createElement('option');
    option.value = zone;
    option.textContent = timezoneLabel(zone);
    timezoneSelect.append(option);
  });

  timezoneSelect.value = timezone;
  timezoneSelect.addEventListener('change', () => {
    timezone = timezoneSelect.value;
    renderSchedule();
  });
}

function applyTeamFilter(teams) {
  selectedTeams = new Set(teams);
  saveTeams();
  for (const checkbox of teamFilterEl.querySelectorAll('input[type="checkbox"]')) {
    checkbox.checked = selectedTeams.has(checkbox.value);
  }
  renderSchedule();
}

function setupPredefinedFilters() {
  // Build group → teams map from matches
  const groupMap = new Map();
  for (const match of matches) {
    if (!match.group) continue;
    if (!groupMap.has(match.group)) groupMap.set(match.group, new Set());
    groupMap.get(match.group).add(match.homeTeam);
    groupMap.get(match.group).add(match.awayTeam);
  }

  if (predefinedGroupFiltersEl) {
    const sortedGroups = [...groupMap.keys()].sort();
    for (const group of sortedGroups) {
      const btn = document.createElement('button');
      btn.className = 'predefined-filter-btn';
      btn.textContent = t('group_label', group);
      btn.addEventListener('click', () => applyTeamFilter([...groupMap.get(group)]));
      predefinedGroupFiltersEl.append(btn);
    }
  }

  if (predefinedContinentFiltersEl) {
    for (const [continent, teams] of Object.entries(CONTINENT_TEAMS)) {
      const btn = document.createElement('button');
      btn.className = 'predefined-filter-btn';
      btn.textContent = localizeContinent(continent);
      btn.addEventListener('click', () => applyTeamFilter(teams));
      predefinedContinentFiltersEl.append(btn);
    }
  }
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

    label.append(checkbox, ` ${localizeTeamName(team)}`);
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
    renderSection(t('upcoming_matches'), upcoming, t('no_upcoming')),
    renderSection(t('past_matches'), past, t('no_past'))
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
    teams.textContent = `${localizeTeamName(match.homeTeam)} vs ${localizeTeamName(match.awayTeam)}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${formatKickoff(match.utcKickoff, timezone, getLocale())} (${timezoneLabel(timezone)}) · ${match.venue}`;

    const score = document.createElement('div');
    score.className = 'meta';
    score.textContent = match.score ?? t('tbd');

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
      alert(t('max_filters', MAX_SAVED_FILTERS));
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
    empty.textContent = t('no_saved_filters');
    savedFiltersListEl.append(empty);
    return;
  }

  for (let i = 0; i < filters.length; i++) {
    const { name, teams } = filters[i];

    const pill = document.createElement('span');
    pill.className = 'saved-filter-pill';

    const loadBtn = document.createElement('button');
    loadBtn.className = 'saved-filter-load';
    loadBtn.textContent = name;
    loadBtn.title = t('load_filter', name);
    loadBtn.addEventListener('click', () => {
      applyTeamFilter(teams);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'saved-filter-remove';
    removeBtn.textContent = '×';
    removeBtn.title = t('remove_filter', name);
    removeBtn.addEventListener('click', () => {
      const current = loadSavedFilters();
      const idx = current.findIndex((f, j) => f.name === name && j >= i);
      if (idx !== -1) current.splice(idx, 1);
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
