const LANG_KEY = 'worldcup-2026-lang';

const TRANSLATIONS = {
  en: {
    nav_schedule: 'Schedule',
    nav_standings: 'Standings',
    nav_knockout: 'Knockout',
    timezone_label: 'Timezone',
    team_filter_heading: 'Team filter',
    team_filter_hint: 'Select one or more teams to filter matches.',
    clear_selected: 'Clear all selected teams',
    by_group: 'By group',
    by_confederation: 'By confederation',
    show_hide_teams: 'Show / hide all teams',
    filter_name_placeholder: 'Filter name',
    save_filter: 'Save filter',
    schedule_heading: 'Schedule',
    upcoming_matches: 'Upcoming matches',
    past_matches: 'Past matches',
    no_upcoming: 'No upcoming matches for the selected filters.',
    no_past: 'No past matches for the selected filters.',
    no_saved_filters: 'No saved filters yet.',
    standings_heading: 'Standings',
    knockout_heading: 'Knockout stages',
    bracket_view: 'Bracket view',
    bracket_unavailable: 'Bracket data is unavailable.',
    bracket_fixtures_unavailable: 'Bracket fixtures are unavailable.',
    'Round of 32': 'Round of 32',
    'Round of 16': 'Round of 16',
    'Quarter-finals': 'Quarter-finals',
    'Semi-finals': 'Semi-finals',
    'Final': 'Final',
    'Third-place play-off': 'Third-place play-off',
    view_on_github: 'View on GitHub',
    tbd: 'TBD',
    col_team: 'Team',
    col_played: 'P',
    col_won: 'W',
    col_drawn: 'D',
    col_lost: 'L',
    col_gf: 'GF',
    col_ga: 'GA',
    col_pts: 'Pts',
    group_label: (g) => `Group ${g}`,
    load_filter: (name) => `Load filter: ${name}`,
    remove_filter: (name) => `Remove filter: ${name}`,
    max_filters: (max) => `You can save at most ${max} filters. Please remove one first.`,
    load_error_schedule: (msg) => `Unable to load schedule: ${msg}`,
    load_error_standings: (msg) => `Unable to load standings: ${msg}`,
    load_error_knockout: (msg) => `Unable to load knockout stages: ${msg}`,
  },
  zh: {
    nav_schedule: '赛程',
    nav_standings: '积分榜',
    nav_knockout: '淘汰赛',
    timezone_label: '时区',
    team_filter_heading: '球队筛选',
    team_filter_hint: '选择一支或多支球队来筛选比赛。',
    clear_selected: '清除所有已选球队',
    by_group: '按小组',
    by_confederation: '按大区',
    show_hide_teams: '显示 / 隐藏所有球队',
    filter_name_placeholder: '筛选名称',
    save_filter: '保存筛选',
    schedule_heading: '赛程',
    upcoming_matches: '即将进行的比赛',
    past_matches: '已完成的比赛',
    no_upcoming: '没有符合所选筛选条件的即将进行的比赛。',
    no_past: '没有符合所选筛选条件的已完成的比赛。',
    no_saved_filters: '暂无已保存的筛选。',
    standings_heading: '积分榜',
    knockout_heading: '淘汰赛阶段',
    bracket_view: '对阵图',
    bracket_unavailable: '对阵图数据不可用。',
    bracket_fixtures_unavailable: '对阵图赛事不可用。',
    'Round of 32': '32强赛',
    'Round of 16': '16强赛',
    'Quarter-finals': '四分之一决赛',
    'Semi-finals': '半决赛',
    'Final': '决赛',
    'Third-place play-off': '季军争夺战',
    view_on_github: '在GitHub上查看',
    tbd: '待定',
    col_team: '球队',
    col_played: '场',
    col_won: '胜',
    col_drawn: '平',
    col_lost: '负',
    col_gf: '进',
    col_ga: '失',
    col_pts: '积分',
    group_label: (g) => `${g}组`,
    load_filter: (name) => `加载筛选：${name}`,
    remove_filter: (name) => `删除筛选：${name}`,
    max_filters: (max) => `最多只能保存 ${max} 个筛选，请先删除一个。`,
    load_error_schedule: (msg) => `无法加载赛程：${msg}`,
    load_error_standings: (msg) => `无法加载积分榜：${msg}`,
    load_error_knockout: (msg) => `无法加载淘汰赛阶段：${msg}`,
  },
};

let currentLang = 'en';
try {
  currentLang = localStorage.getItem(LANG_KEY) || 'en';
} catch {
  // localStorage unavailable; default to English
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
  location.reload();
}

export function t(key, ...args) {
  const val = TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}

export function getLocale() {
  return currentLang === 'zh' ? 'zh-CN' : 'en';
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (el.tagName === 'INPUT') {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });
  document.documentElement.lang = currentLang === 'zh' ? 'zh' : 'en';
}

export function setupLangSwitcher() {
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    const lang = btn.getAttribute('data-set-lang');
    btn.classList.toggle('lang-btn-active', lang === currentLang);
    btn.addEventListener('click', () => setLang(lang));
  });
}

export function initI18n() {
  applyTranslations();
  setupLangSwitcher();
}
