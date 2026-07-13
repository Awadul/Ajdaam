// Downloads every media asset from the exported Instagram timeline into /public/media.
//
//   node scripts/fetch-assets.mjs
//
// Instagram CDN URLs are signed and expire within days of export. If a download
// 403s, re-run the console scraper to get a fresh timeline.json, then run this again.

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'media');
const timeline = JSON.parse(await readFile(path.join(root, 'src/data/timeline.json'), 'utf8'));

await mkdir(outDir, { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);

const jobs = [];
for (const post of timeline) {
  post.media.forEach((m, i) => {
    const ext = m.type === 'video' ? 'mp4' : 'jpg';
    jobs.push({ url: m.url, file: `${post.code}-${i}.${ext}` });
    if (m.poster) jobs.push({ url: m.poster, file: `${post.code}-${i}-poster.jpg` });
  });
}

let ok = 0;
let skipped = 0;
const failed = [];

// Four at a time. Instagram throttles aggressively past that.
const queue = [...jobs];
const worker = async () => {
  while (queue.length) {
    const { url, file } = queue.shift();
    const dest = path.join(outDir, file);

    if (await exists(dest)) {
      skipped++;
      continue;
    }

    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://www.instagram.com/' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      ok++;
      process.stdout.write(`\r  ${ok} downloaded, ${skipped} skipped, ${failed.length} failed`);
    } catch (err) {
      failed.push({ file, reason: err.message });
    }
  }
};

console.log(`Fetching ${jobs.length} assets into public/media\n`);
await Promise.all(Array.from({ length: 4 }, worker));

console.log(`\n\nDone. ${ok} downloaded, ${skipped} already present, ${failed.length} failed.`);
if (failed.length) {
  console.log('\nFailed:');
  for (const f of failed) console.log(`  ${f.file} — ${f.reason}`);
  console.log('\nExpired signatures are the usual cause. Re-export timeline.json and retry.');
}
