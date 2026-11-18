import { readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const featuredName = 'vision-hub-kota.mp4';
const supportedFormats = new Set(['.mp4', '.webm']);
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/** Discover uploaded reels at build time; never request a missing placeholder video.
 * @param {string} folder
 */
export function getReels(folder = join(process.cwd(), 'public', 'reels')) {
  let files;
  try {
    files = readdirSync(folder, { withFileTypes: true });
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT') return [];
    throw error;
  }

  const filenames = files.filter((file) => file.isFile() && !file.name.startsWith('.')).map((file) => file.name);
  return filenames
    .filter((name) => supportedFormats.has(extname(name).toLowerCase()))
    .sort((a, b) => Number(b.toLowerCase() === featuredName) - Number(a.toLowerCase() === featuredName) || collator.compare(a, b))
    .map((name) => {
      const extension = extname(name);
      const stem = name.slice(0, -extension.length);
      const caption = `${stem}.vtt`;
      const readable = stem.replace(/[_-]+/g, ' ').trim();

      return {
        title: name.toLowerCase() === featuredName ? 'Inside Vision Hub' : readable.replace(/^./u, (letter) => letter.toUpperCase()) || 'Vision Hub Reel',
        url: `/reels/${encodeURIComponent(name)}`,
        captions: filenames.includes(caption) ? `/reels/${encodeURIComponent(caption)}` : undefined,
      };
    });
}
