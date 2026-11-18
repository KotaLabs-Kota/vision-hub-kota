import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { reelDuration } from './reel-format.mjs';

const featuredName = 'vision-hub-kota.mp4';
const supportedFormats = new Set(['.mp4', '.webm']);
const posterFormats = ['.webp', '.jpg', '.jpeg', '.png'];
const metadataName = 'reels.json';
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/** @param {string} name */
const reelUrl = (name) => `/reels/${encodeURIComponent(name)}`;

/** @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** @param {string} path */
function readMetadata(path) {
  try {
    const data = /** @type {unknown} */ (JSON.parse(readFileSync(path, 'utf8')));
    if (!isRecord(data)) throw new Error('Expected an object keyed by video filename.');
    return data;
  } catch (error) {
    throw new Error(`Invalid public/reels/${metadataName}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
}

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

  const filenames = new Set(files.filter((file) => file.isFile() && !file.name.startsWith('.')).map((file) => file.name));
  const metadata = filenames.has(metadataName) ? readMetadata(join(folder, metadataName)) : {};
  return [...filenames]
    .filter((name) => supportedFormats.has(extname(name).toLowerCase()))
    .sort((a, b) => Number(b.toLowerCase() === featuredName) - Number(a.toLowerCase() === featuredName) || collator.compare(a, b))
    .map((name) => {
      const extension = extname(name);
      const stem = name.slice(0, -extension.length);
      const caption = `${stem}.vtt`;
      const poster = posterFormats.map((format) => `${stem}${format}`).find((file) => filenames.has(file));
      const readable = stem.replace(/^\d+[-_\s]+(?=\S)/u, '').replace(/[_-]+/g, ' ').trim();
      const fallbackTitle = readable.replace(/^./u, (letter) => letter.toUpperCase()) || 'Vision Hub Reel';
      const details = Object.hasOwn(metadata, name) ? metadata[name] : undefined;
      const title = isRecord(details) && typeof details.title === 'string' ? details.title.trim() : '';

      return {
        title: title || (name.toLowerCase() === featuredName ? 'Inside Vision Hub' : fallbackTitle),
        url: reelUrl(name),
        captions: filenames.has(caption) ? reelUrl(caption) : undefined,
        poster: poster ? reelUrl(poster) : undefined,
        duration: isRecord(details) ? reelDuration(details.durationSeconds) : undefined,
      };
    });
}
