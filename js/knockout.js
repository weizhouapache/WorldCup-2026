import { fetchJson, formatKickoff, getPersistedTimezone, persistTimezone, timezoneOptions, timezoneLabel } from './common.js';
import { t, getLocale, initI18n, localizeTeamName } from './i18n.js';

const knockoutEl = document.querySelector('#knockout');
const timezoneSelect = document.querySelector('#timezone');
let timezone = getPersistedTimezone();
const SVG_NS = 'http://www.w3.org/2000/svg';
const BRACKET_ROUND_NAMES = ['Round of 32', 'Round of 16', 'Quarter-final', 'Semi-final', 'Final'];
const FINAL_TO_THIRD_PLACE_GAP = 120;
const MAX_MATCHUP_TEXT_LENGTH = 34;

init().catch((error) => {
  knockoutEl.textContent = t('load_error_knockout', error.message);
});

async function init() {
  const data = await fetchJson('./data/knockout.json');

  initI18n();
  setupTimezone();
  render(data.rounds);
}

function setupTimezone() {
  if (!timezoneSelect) return;

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
    persistTimezone(timezone);
    knockoutEl.innerHTML = '';
    fetchJson('./data/knockout.json').then((data) => render(data.rounds));
  });
}

function render(rounds) {
  knockoutEl.append(buildBracketImage(rounds));

  for (const round of rounds) {
    const section = document.createElement('section');
    section.className = 'round';

    const title = document.createElement('h3');
    title.textContent = t(round.name);
    section.append(title);

    for (const fixture of round.fixtures) {
      const card = document.createElement('article');
      card.className = 'match-card';

      const teams = document.createElement('div');
      const hasScore = fixture.score && fixture.score !== '-';
      const scoreDisplay = hasScore ? fixture.score.replace('-', ':') : '';
      const teamsText = hasScore
        ? `${localizeTeamName(fixture.homeTeam)} ${scoreDisplay} ${localizeTeamName(fixture.awayTeam)}`
        : `${localizeTeamName(fixture.homeTeam)} vs ${localizeTeamName(fixture.awayTeam)}`;
      if (fixture.link) {
        const link = document.createElement('a');
        link.href = fixture.link;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = teamsText;
        teams.append(link);
      } else {
        teams.textContent = teamsText;
      }

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${formatKickoff(fixture.utcKickoff, timezone, getLocale())} (${timezoneLabel(timezone)}) · ${fixture.venue}`;

      card.append(teams, meta);
      section.append(card);
    }

    knockoutEl.append(section);
  }
}

function parseSourceFixtureId(teamName) {
  const match = teamName?.match(/Winner\s+([\w]+-\d+)/i);
  return match ? match[1].toLowerCase() : null;
}

function buildOrderedRounds(stageRounds) {
  // Build a map from fixture id to {fixture, roundIndex}
  const fixtureMap = new Map();
  stageRounds.forEach((round, roundIndex) => {
    round.fixtures.forEach((fixture) => {
      fixtureMap.set(fixture.id, { fixture, roundIndex });
    });
  });

  // Return the fixture list for a given round in the visual bracket order,
  // determined by tracing source-fixture references from later rounds.
  function getOrderedFixtures(roundIndex) {
    if (roundIndex >= stageRounds.length - 1) {
      return stageRounds[roundIndex].fixtures.slice();
    }

    const nextOrdered = getOrderedFixtures(roundIndex + 1);
    const result = [];
    const added = new Set();

    for (const nextFixture of nextOrdered) {
      const sourceIds = [nextFixture.homeTeam, nextFixture.awayTeam]
        .map((team) => parseSourceFixtureId(team))
        .filter(Boolean);

      for (const sourceId of sourceIds) {
        const entry = fixtureMap.get(sourceId);
        if (entry && entry.roundIndex === roundIndex && !added.has(sourceId)) {
          result.push(entry.fixture);
          added.add(sourceId);
        }
      }
    }

    // Append any fixtures not reached by the traversal (e.g. incomplete bracket data)
    for (const fixture of stageRounds[roundIndex].fixtures) {
      if (!added.has(fixture.id)) {
        result.push(fixture);
      }
    }

    return result;
  }

  return stageRounds.map((round, roundIndex) => ({
    ...round,
    fixtures: getOrderedFixtures(roundIndex),
  }));
}

function buildBracketImage(rounds) {
  const stageRounds = BRACKET_ROUND_NAMES
    .map((roundName) => rounds.find((round) => round.name === roundName))
    .filter(Boolean);
  const thirdPlaceRound = rounds.find((round) => round.name === 'Play-off for third place');

  const section = document.createElement('section');
  section.className = 'bracket-chart';

  const title = document.createElement('h3');
  title.textContent = t('bracket_view');
  section.append(title);

  if (stageRounds.length === 0) {
    const fallback = document.createElement('p');
    fallback.textContent = t('bracket_unavailable');
    section.append(fallback);
    return section;
  }

  const orderedStageRounds = buildOrderedRounds(stageRounds);

  const wrapper = document.createElement('div');
  wrapper.className = 'bracket-wrapper';

  const cardWidth = 230;
  const cardHeight = 44;
  const columnGap = 90;
  const firstRoundGap = 20;
  const paddingX = 30;
  const paddingY = 30;

  const roundCards = [];
  orderedStageRounds.forEach((round, roundIndex) => {
    const cards = [];
    const x = paddingX + roundIndex * (cardWidth + columnGap);
    const previousRoundCards = roundCards[roundIndex - 1] ?? [];

    round.fixtures.forEach((fixture, fixtureIndex) => {
      let y = paddingY + fixtureIndex * (cardHeight + firstRoundGap);
      if (roundIndex > 0) {
        const upper = previousRoundCards[fixtureIndex * 2];
        const lower = previousRoundCards[fixtureIndex * 2 + 1];
        y = ((upper.cy + lower.cy) / 2) - cardHeight / 2;
      }

      cards.push({
        fixture,
        roundName: round.name,
        x,
        y,
        left: x,
        right: x + cardWidth,
        cy: y + cardHeight / 2,
      });
    });

    roundCards.push(cards);
  });

  const finalRoundCards = roundCards[roundCards.length - 1];
  const firstRoundCards = roundCards[0];
  if (!firstRoundCards?.length || !finalRoundCards?.length) {
    const fallback = document.createElement('p');
    fallback.textContent = t('bracket_fixtures_unavailable');
    section.append(fallback);
    return section;
  }

  const baseHeight = firstRoundCards[firstRoundCards.length - 1].y + cardHeight + paddingY;
  let width = paddingX * 2 + orderedStageRounds.length * cardWidth + (orderedStageRounds.length - 1) * columnGap;
  let height = baseHeight;
  let thirdPlaceCard = null;

  if (thirdPlaceRound?.fixtures?.[0]) {
    const fixture = thirdPlaceRound.fixtures[0];
    const x = paddingX + Math.max(0, orderedStageRounds.length - 2) * (cardWidth + columnGap);
    const y = Math.max(finalRoundCards[0].y + FINAL_TO_THIRD_PLACE_GAP, baseHeight - cardHeight - paddingY);
    thirdPlaceCard = {
      fixture,
      roundName: thirdPlaceRound.name,
      x,
      y,
      left: x,
      right: x + cardWidth,
      cy: y + cardHeight / 2,
      isThirdPlace: true,
    };
    width = Math.max(width, x + cardWidth + paddingX);
    height = Math.max(height, y + cardHeight + paddingY);
  }

  const svg = createSvgElement('svg', {
    class: 'bracket-svg',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': 'Knockout stage bracket chart',
  });

  orderedStageRounds.forEach((round, roundIndex) => {
    const label = createSvgElement('text', {
      x: paddingX + roundIndex * (cardWidth + columnGap) + cardWidth / 2,
      y: 18,
      class: 'bracket-round-label',
      'text-anchor': 'middle',
    });
    label.textContent = t(round.name);
    svg.append(label);
  });

  for (let roundIndex = 1; roundIndex < roundCards.length; roundIndex += 1) {
    const previousRound = roundCards[roundIndex - 1];
    const currentRound = roundCards[roundIndex];
    currentRound.forEach((card, fixtureIndex) => {
      const topSource = previousRound[fixtureIndex * 2];
      const bottomSource = previousRound[fixtureIndex * 2 + 1];
      appendConnector(svg, topSource, bottomSource, card);
    });
  }

  if (thirdPlaceCard) {
    const semiFinalCards = roundCards[roundCards.length - 2] ?? [];
    if (semiFinalCards.length === 2) {
      appendConnector(svg, semiFinalCards[0], semiFinalCards[1], thirdPlaceCard, true);
      const thirdLabel = createSvgElement('text', {
        x: thirdPlaceCard.x + cardWidth / 2,
        y: thirdPlaceCard.y - 10,
        class: 'bracket-third-place-label',
        'text-anchor': 'middle',
      });
      thirdLabel.textContent = t('Third-place play-off');
      svg.append(thirdLabel);
    }
  }

  roundCards.flat().forEach((card) => {
    appendMatchCard(svg, card, cardWidth, cardHeight);
  });

  if (thirdPlaceCard) {
    appendMatchCard(svg, thirdPlaceCard, cardWidth, cardHeight);
  }

  wrapper.append(svg);
  section.append(wrapper);
  return section;
}

function formatFixtureId(fixtureId) {
  return fixtureId.toUpperCase();
}

function createSvgElement(tag, attributes) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

function appendConnector(svg, topSource, bottomSource, target, dashed = false) {
  const laneX = (topSource.right + target.left) / 2;
  const className = dashed ? 'bracket-connector bracket-connector-dashed' : 'bracket-connector';

  // Draw two incoming horizontal lines, one shared vertical lane, then one outgoing horizontal line.
  svg.append(
    createSvgElement('line', { x1: topSource.right, y1: topSource.cy, x2: laneX, y2: topSource.cy, class: className }),
    createSvgElement('line', { x1: bottomSource.right, y1: bottomSource.cy, x2: laneX, y2: bottomSource.cy, class: className }),
    createSvgElement('line', { x1: laneX, y1: topSource.cy, x2: laneX, y2: bottomSource.cy, class: className }),
    createSvgElement('line', { x1: laneX, y1: target.cy, x2: target.left, y2: target.cy, class: className })
  );
}

function appendMatchCard(svg, card, cardWidth, cardHeight) {
  const fixtureId = formatFixtureId(card.fixture.id);
  const matchup = `${localizeTeamName(card.fixture.homeTeam)} vs ${localizeTeamName(card.fixture.awayTeam)}`;

  svg.append(createSvgElement('rect', { x: card.x, y: card.y, width: cardWidth, height: cardHeight, rx: 8, class: 'bracket-match-card' }));

  const idText = createSvgElement('text', { x: card.x + 10, y: card.y + 14, class: 'bracket-match-id' });
  idText.textContent = fixtureId;

  const matchupText = createSvgElement('text', { x: card.x + 10, y: card.y + 29, class: 'bracket-matchup' });
  matchupText.textContent = clampText(matchup, MAX_MATCHUP_TEXT_LENGTH);

  const scoreText = createSvgElement('text', { x: card.x + 10, y: card.y + 40, class: 'bracket-score' });
  scoreText.textContent = card.fixture.score ?? '-';

  svg.append(idText, matchupText, scoreText);
}

function clampText(value, maxLength) {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}
