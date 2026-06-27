const LANG_KEY = 'worldcup-2026-lang';

const LOCALIZED_ENTITIES = {
  en: {
    confederations: {
      AFC: 'Asia',
      CAF: 'Africa',
      CONCACAF: 'North, Central America and the Caribbean',
      CONMEBOL: 'South America',
      OFC: 'Oceania',
      UEFA: 'Europe',
    },
  },
  zh: {
    teams: {
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
      'Congo DR': '刚果（金）',
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
      'Korea Republic': '韩国',
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
      USA: '美国',
      Uzbekistan: '乌兹别克斯坦',
    },
    confederations: {
      AFC: '亚洲',
      CAF: '非洲',
      CONCACAF: '中北美及加勒比海',
      CONMEBOL: '南美洲',
      OFC: '大洋洲',
      UEFA: '欧洲',
    },
    teamPatterns: [
      {
        regex: /^Winner Group ([A-Z])$/,
        format: (match) => `${match[1]}组第一`,
      },
      {
        regex: /^Runner-up Group ([A-Z])$/,
        format: (match) => `${match[1]}组第二`,
      },
      {
        regex: /^Best 3rd \(([^)]+)\)$/,
        format: (match) => `最佳小组第三 (${match[1]})`,
      },
      {
        regex: /^Winner Match (\d+)$/,
        format: (match) => `比赛${match[1]}胜者`,
      },
      {
        regex: /^Runner-up Match (\d+)$/,
        format: (match) => `比赛${match[1]}负者`,
      },
      {
        regex: /^Best Third-place (\d+)$/,
        format: (match) => `最佳小组第三 ${match[1]}`,
      },
      {
        regex: /^Winner (R32|R16|QF|SF)-(\d+)$/i,
        format: (match) => {
          const roundLabel = {
            R32: '32强赛',
            R16: '16强赛',
            QF: '四分之一决赛',
            SF: '半决赛',
          }[match[1].toUpperCase()];
          return `${roundLabel}胜者 ${match[2]}`;
        },
      },
      {
        regex: /^Loser (R32|R16|QF|SF)-(\d+)$/i,
        format: (match) => {
          const roundLabel = {
            R32: '32强赛',
            R16: '16强赛',
            QF: '四分之一决赛',
            SF: '半决赛',
          }[match[1].toUpperCase()];
          return `${roundLabel}负者 ${match[2]}`;
        },
      },
      {
        regex: /^Loser SF-(\d+)$/,
        format: (match) => `半决赛负者 ${match[1]}`,
      },
    ],
  },
  nl: {
    confederations: {
      AFC: 'Azië',
      CAF: 'Afrika',
      CONCACAF: 'Noord-, Midden-Amerika en het Caribisch gebied',
      CONMEBOL: 'Zuid-Amerika',
      OFC: 'Oceanië',
      UEFA: 'Europa',
    },
    teamPatterns: [
      {
        regex: /^Winner Group ([A-Z])$/,
        format: (match) => `Winnaar groep ${match[1]}`,
      },
      {
        regex: /^Runner-up Group ([A-Z])$/,
        format: (match) => `Nummer twee groep ${match[1]}`,
      },
      {
        regex: /^Best 3rd \(([^)]+)\)$/,
        format: (match) => `Beste derde (${match[1]})`,
      },
      {
        regex: /^Winner Match (\d+)$/,
        format: (match) => `Winnaar wedstrijd ${match[1]}`,
      },
      {
        regex: /^Runner-up Match (\d+)$/,
        format: (match) => `Verliezer wedstrijd ${match[1]}`,
      },
      {
        regex: /^Best Third-place (\d+)$/,
        format: (match) => `Beste nummer drie ${match[1]}`,
      },
      {
        regex: /^Winner (R32|R16|QF|SF)-(\d+)$/i,
        format: (match) => {
          const roundLabel = {
            R32: '32e finale',
            R16: 'achtste finale',
            QF: 'kwartfinale',
            SF: 'halve finale',
          }[match[1].toUpperCase()];
          return `Winnaar ${roundLabel} ${match[2]}`;
        },
      },
      {
        regex: /^Loser (R32|R16|QF|SF)-(\d+)$/i,
        format: (match) => {
          const roundLabel = {
            R32: '32e finale',
            R16: 'achtste finale',
            QF: 'kwartfinale',
            SF: 'halve finale',
          }[match[1].toUpperCase()];
          return `Verliezer ${roundLabel} ${match[2]}`;
        },
      },
      {
        regex: /^Loser SF-(\d+)$/,
        format: (match) => `Verliezer halve finale ${match[1]}`,
      },
    ],
  },
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
    'Quarter-final': 'Quarter-finals',
    'Quarter-finals': 'Quarter-finals',
    'Semi-final': 'Semi-finals',
    'Semi-finals': 'Semi-finals',
    'Final': 'Final',
    'Play-off for third place': 'Third-place play-off',
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
    by_confederation: '按联合会',
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
    'Quarter-final': '四分之一决赛',
    'Quarter-finals': '四分之一决赛',
    'Semi-final': '半决赛',
    'Semi-finals': '半决赛',
    'Final': '决赛',
    'Play-off for third place': '季军争夺战',
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
  nl: {
    nav_schedule: 'Schema',
    nav_standings: 'Stand',
    nav_knockout: 'Knock-out',
    timezone_label: 'Tijdzone',
    team_filter_heading: 'Teamfilter',
    team_filter_hint: 'Selecteer één of meer teams om wedstrijden te filteren.',
    clear_selected: 'Wis alle geselecteerde teams',
    by_group: 'Per groep',
    by_confederation: 'Per confederatie',
    show_hide_teams: 'Toon / verberg alle teams',
    filter_name_placeholder: 'Filternaam',
    save_filter: 'Filter opslaan',
    schedule_heading: 'Schema',
    upcoming_matches: 'Aankomende wedstrijden',
    past_matches: 'Afgelopen wedstrijden',
    no_upcoming: 'Geen aankomende wedstrijden voor de gekozen filters.',
    no_past: 'Geen afgelopen wedstrijden voor de gekozen filters.',
    no_saved_filters: 'Nog geen opgeslagen filters.',
    standings_heading: 'Stand',
    knockout_heading: 'Knock-outfase',
    bracket_view: 'Toernooischema',
    bracket_unavailable: 'Toernooischemagegevens zijn niet beschikbaar.',
    bracket_fixtures_unavailable: 'Wedstrijden in het toernooischema zijn niet beschikbaar.',
    'Round of 32': '32e finales',
    'Round of 16': 'Achtste finales',
    'Quarter-final': 'Kwartfinales',
    'Quarter-finals': 'Kwartfinales',
    'Semi-final': 'Halve finales',
    'Semi-finals': 'Halve finales',
    'Final': 'Finale',
    'Play-off for third place': 'Wedstrijd om de derde plaats',
    'Third-place play-off': 'Wedstrijd om de derde plaats',
    view_on_github: 'Bekijk op GitHub',
    tbd: 'N.t.b.',
    col_team: 'Team',
    col_played: 'G',
    col_won: 'W',
    col_drawn: 'GL',
    col_lost: 'V',
    col_gf: 'DV',
    col_ga: 'DT',
    col_pts: 'Ptn',
    group_label: (g) => `Groep ${g}`,
    load_filter: (name) => `Filter laden: ${name}`,
    remove_filter: (name) => `Filter verwijderen: ${name}`,
    max_filters: (max) => `Je kunt maximaal ${max} filters opslaan. Verwijder er eerst één.`,
    load_error_schedule: (msg) => `Schema kan niet worden geladen: ${msg}`,
    load_error_standings: (msg) => `Stand kan niet worden geladen: ${msg}`,
    load_error_knockout: (msg) => `Knock-outfase kan niet worden geladen: ${msg}`,
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
  if (currentLang === 'zh') return 'zh-CN';
  if (currentLang === 'nl') return 'nl-NL';
  return 'en-US';
}

export function localizeTeamName(teamName) {
  const mappedName = localizeEntity('teams', teamName);
  if (mappedName !== teamName) {
    return mappedName;
  }

  const teamPatterns = LOCALIZED_ENTITIES[currentLang]?.teamPatterns ?? [];
  for (const { regex, format } of teamPatterns) {
    const match = teamName.match(regex);
    if (match) {
      return format(match);
    }
  }

  return teamName;
}

export function localizeConfederation(confederation) {
  return localizeEntity('confederations', confederation);
}

function localizeEntity(category, value) {
  const map = LOCALIZED_ENTITIES[currentLang]?.[category];
  return map?.[value] ?? value;
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
  document.documentElement.lang = currentLang;
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
