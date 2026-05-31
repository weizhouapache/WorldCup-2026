const LANG_KEY = 'worldcup-2026-lang';

const TEAM_NAMES_ZH = {
  Algeria: '阿尔及利亚',
  Argentina: '阿根廷',
  Australia: '澳大利亚',
  Austria: '奥地利',
  Belgium: '比利时',
  'Bosnia and Herzegovina': '波黑',
  Brazil: '巴西',
  'Cabo Verde': '佛得角',
  Canada: '加拿大',
  Colombia: '哥伦比亚',
  Croatia: '克罗地亚',
  Curaçao: '库拉索',
  Czechia: '捷克',
  'Côte d\'Ivoire': '科特迪瓦',
  'DR Congo': '刚果（金）',
  Ecuador: '厄瓜多尔',
  Egypt: '埃及',
  England: '英格兰',
  France: '法国',
  Germany: '德国',
  Ghana: '加纳',
  Haiti: '海地',
  'IR Iran': '伊朗',
  Iraq: '伊拉克',
  Japan: '日本',
  Jordan: '约旦',
  Mexico: '墨西哥',
  Morocco: '摩洛哥',
  Netherlands: '荷兰',
  'New Zealand': '新西兰',
  Norway: '挪威',
  Panama: '巴拿马',
  Paraguay: '巴拉圭',
  Portugal: '葡萄牙',
  Qatar: '卡塔尔',
  'Saudi Arabia': '沙特阿拉伯',
  Scotland: '苏格兰',
  Senegal: '塞内加尔',
  'South Africa': '南非',
  'South Korea': '韩国',
  Spain: '西班牙',
  Sweden: '瑞典',
  Switzerland: '瑞士',
  Tunisia: '突尼斯',
  Türkiye: '土耳其',
  'United States': '美国',
  Uruguay: '乌拉圭',
  Uzbekistan: '乌兹别克斯坦',
};

const CONFEDERATION_NAMES_ZH = {
  AFC: '亚洲（AFC）',
  CAF: '非洲（CAF）',
  CONCACAF: '中北美及加勒比海（CONCACAF）',
  CONMEBOL: '南美洲（CONMEBOL）',
  OFC: '大洋洲（OFC）',
  UEFA: '欧洲（UEFA）',
};

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
  return currentLang === 'zh' ? 'zh-CN' : 'en-US';
}

export function localizeTeamName(teamName) {
  if (currentLang !== 'zh') {
    return teamName;
  }
  return TEAM_NAMES_ZH[teamName] ?? teamName;
}

export function localizeConfederation(confederation) {
  if (currentLang !== 'zh') {
    return confederation;
  }
  return CONFEDERATION_NAMES_ZH[confederation] ?? confederation;
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
