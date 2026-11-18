import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { getReels } from '../src/lib/reels.mjs';
import { reelDuration } from '../src/lib/reel-format.mjs';

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'vision-hub-reels-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('an absent or empty media folder produces no clips', (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, '.gitkeep'), '');
  writeFileSync(join(directory, 'notes.txt'), '');
  assert.deepEqual(getReels(join(directory, 'absent')), []);
  assert.deepEqual(getReels(directory), []);
});

test('the preferred upload is featured and reel filenames sort numerically', (t) => {
  const directory = fixture(t);
  for (const name of ['reel-10.mp4', '.hidden.mp4', 'reel-2.WEBM', 'vision-hub-kota.mp4', 'other.mov']) {
    writeFileSync(join(directory, name), '');
  }
  mkdirSync(join(directory, 'folder.mp4'));
  assert.deepEqual(getReels(directory).map(({ title, url }) => [title, url]), [
    ['Inside Vision Hub', '/reels/vision-hub-kota.mp4'],
    ['Reel 2', '/reels/reel-2.WEBM'],
    ['Reel 10', '/reels/reel-10.mp4'],
  ]);
});

test('poster and caption sidecars are optional and URL-sensitive names are encoded', (t) => {
  const directory = fixture(t);
  for (const name of ['frame #1.mp4', 'frame #1.vtt', 'frame #1.webp', 'frame #1.jpg', 'try_on.mp4']) writeFileSync(join(directory, name), '');
  assert.deepEqual(getReels(directory), [
    { title: 'Frame #1', url: '/reels/frame%20%231.mp4', captions: '/reels/frame%20%231.vtt', poster: '/reels/frame%20%231.webp', duration: undefined },
    { title: 'Try on', url: '/reels/try_on.mp4', captions: undefined, poster: undefined, duration: undefined },
  ]);
});

test('titles and durations can be customized without changing numeric order', (t) => {
  const directory = fixture(t);
  for (const name of ['01-look-inside.mp4', '02-frame-try-on.mp4', '12-eyewear.webm']) writeFileSync(join(directory, name), '');
  writeFileSync(join(directory, 'reels.json'), JSON.stringify({
    '02-frame-try-on.mp4': { title: '  A frame try-on  ', durationSeconds: 29 },
    '12-eyewear.webm': { title: '', durationSeconds: 0 },
  }));
  assert.deepEqual(getReels(directory).map(({ title, duration }) => [title, duration]), [
    ['Look inside', undefined],
    ['A frame try-on', '0:29'],
    ['Eyewear', undefined],
  ]);
});

test('a malformed optional metadata file identifies the upload path', (t) => {
  const directory = fixture(t);
  writeFileSync(join(directory, 'reels.json'), '[');
  assert.throws(() => getReels(directory), /Invalid public\/reels\/reels\.json/);
});

test('duration labels match native whole seconds and never show non-finite values', () => {
  assert.equal(reelDuration(65.2), '1:05');
  assert.equal(reelDuration(59.8), '0:59');
  assert.equal(reelDuration(0.4), '0:00');
  for (const value of [Infinity, NaN, 0, -3, '42']) assert.equal(reelDuration(value), undefined);
});
