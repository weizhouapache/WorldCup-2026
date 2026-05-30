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
  const gmtStr = new Intl.DateTimeFormat('en', { timeZone: zone, timeZoneName: 'longOffset' })
    .formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? 'GMT';
  const utcOffset = gmtStr === 'GMT'
    ? 'UTC +0000'
    : gmtStr.replace(/GMT([+-])(\d{2}):(\d{2})/, 'UTC $1$2$3');
  return `${abbr} (${utcOffset})`;
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

  return [...new Set(candidates.filter(Boolean))];
}
