import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { getReels } from '../src/lib/reels.mjs';

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

test('spaces and URL-sensitive characters are encoded and matching captions are optional', (t) => {
  const directory = fixture(t);
  for (const name of ['frame #1.mp4', 'frame #1.vtt', 'try_on.mp4']) writeFileSync(join(directory, name), '');
  assert.deepEqual(getReels(directory), [
    { title: 'Frame #1', url: '/reels/frame%20%231.mp4', captions: '/reels/frame%20%231.vtt' },
    { title: 'Try on', url: '/reels/try_on.mp4', captions: undefined },
  ]);
});
