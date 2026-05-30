export async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

export function formatKickoff(utcKickoff, timezone) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    weekday: 'short',
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
    // North America
    'America/New_York',
    'America/Toronto',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Monterrey',
    'Pacific/Honolulu',
    // South America
    'America/Sao_Paulo',
    'America/Argentina/Buenos_Aires',
    'America/Bogota',
    'America/Lima',
    'America/Santiago',
    'America/Caracas',
    // Europe
    'Europe/London',
    'Europe/Lisbon',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Zurich',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Warsaw',
    'Europe/Stockholm',
    'Europe/Helsinki',
    'Europe/Athens',
    'Europe/Bucharest',
    'Europe/Kyiv',
    'Europe/Istanbul',
    'Europe/Moscow',
    // Africa
    'Africa/Casablanca',
    'Africa/Lagos',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Nairobi',
    // Middle East & Asia
    'Asia/Riyadh',
    'Asia/Dubai',
    'Asia/Karachi',
    'Asia/Kolkata',
    'Asia/Dhaka',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Seoul',
    'Asia/Tokyo',
    // Pacific
    'Australia/Perth',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland',
  ];

  const now = new Date();
  return [...new Set(candidates.filter(Boolean))].sort((a, b) => {
    const offsetA = getZoneOffsetMinutes(a, now);
    const offsetB = getZoneOffsetMinutes(b, now);
    const offsetDiff = sortOffset(offsetA) - sortOffset(offsetB);
    if (offsetDiff !== 0) {
      return offsetDiff;
    }
    if (a === 'UTC') {
      return -1;
    }
    if (b === 'UTC') {
      return 1;
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
  const [, sign, hours, minutes] = gmtStr.match(/^GMT([+-])(\d{2}):(\d{2})$/) || [];
  if (!sign || !hours || !minutes) {
    return 0;
  }
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

function sortOffset(offsetMinutes) {
  if (offsetMinutes < 0) {
    return 10000 + Math.abs(offsetMinutes);
  }
  return offsetMinutes;
}
