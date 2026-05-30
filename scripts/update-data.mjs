import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sources = {
  schedule: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/fixtures',
  standings: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/standings',
  knockout: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026'
};

const now = new Date().toISOString();

await mkdir('data/raw', { recursive: true });

for (const [name, url] of Object.entries(sources)) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'worldcup-2026-tracker-bot' } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const rawPath = `data/raw/${name}.html`;

    let existingHtml = null;
    try {
      existingHtml = await readFile(rawPath, 'utf8');
    } catch {
      // File doesn't exist yet
    }

    if (existingHtml === html) {
      console.log(`No changes for ${name}, skipping.`);
      continue;
    }

    await writeFile(rawPath, html);

    const jsonPath = `data/${name}.json`;
    let current = {};
    try {
      current = JSON.parse(await readFile(jsonPath, 'utf8'));
    } catch {
      current = {};
    }

    // Only update updatedAt (and write the JSON) if non-metadata fields changed.
    // updatedAt and source are metadata; everything else (matches, groups, rounds…) is data.
    const { updatedAt: _existingAt, source: _existingSource, ...existingData } = current;
    const sourceChanged = current.source !== url;

    if (Object.keys(existingData).length > 0 && !sourceChanged) {
      console.log(`No data changes for ${name}, skipping JSON update.`);
      continue;
    }

    current.updatedAt = now;
    current.source = url;
    await writeFile(jsonPath, `${JSON.stringify(current, null, 2)}\n`);
  } catch (error) {
    console.warn(`Skipping ${name}: ${error.message}`);
  }
}
