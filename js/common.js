export async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

export function formatKickoff(utcKickoff, timezone, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(utcKickoff));
}

export function getDefaultTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function timezoneLabel(zone) {
  const now = new Date();
  const abbr = new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'short' })
    .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? zone;
  const utcOffset = formatUtcOffset(getZoneOffsetMinutes(zone, now));
  return `${zone} (${abbr}, ${utcOffset})`;
}

export function timezoneOptions(defaultTimezone) {
  const candidates = [
    defaultTimezone,
    'UTC',
    // Host city timezones
    'America/New_York',
    'America/Toronto',
    'America/Chicago',
    'America/Los_Angeles',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Monterrey',
    // Western Europe capitals
    'Europe/London',
    'Europe/Lisbon',
    'Europe/Dublin',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Copenhagen',
    'Europe/Vienna',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Oslo',
    'Europe/Stockholm',
    // Asia-Pacific capitals
    'Asia/Shanghai',
    'Asia/Seoul',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const now = new Date();
  return [...new Set(candidates.filter(Boolean))].sort((a, b) => {
    if (a === 'UTC' && b === 'UTC') {
      return 0;
    }
    if (a === 'UTC') {
      return -1;
    }
    if (b === 'UTC') {
      return 1;
    }

    const offsetA = getZoneOffsetMinutes(a, now);
    const offsetB = getZoneOffsetMinutes(b, now);
    const offsetDiff = sortOffset(offsetA) - sortOffset(offsetB);
    if (offsetDiff !== 0) {
      return offsetDiff;
    }
    return a.localeCompare(b);
  });
}

function getZoneOffsetMinutes(zone, date) {
  const gmtStr = new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'longOffset' })
    .formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? 'GMT';
  if (gmtStr === 'GMT') {
    return 0;
  }
  const match = gmtStr.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    return 0;
  }
  const [, sign, hours, minutes] = match;
  const total = Number(hours) * 60 + Number(minutes);
  return sign === '+' ? total : -total;
}

function formatUtcOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
  const minutes = String(absMinutes % 60).padStart(2, '0');
  return `UTC${sign}${hours}${minutes}`;
}

// Larger than max real UTC offset in minutes (UTC+14:00 => 840), so negatives sort last.
const NEGATIVE_OFFSET_SORT_BASE = 10000;

function sortOffset(offsetMinutes) {
  // UTC and positive offsets should appear first; negative offsets are shifted after them.
  if (offsetMinutes < 0) {
    return NEGATIVE_OFFSET_SORT_BASE + Math.abs(offsetMinutes);
  }
  return offsetMinutes;
}
