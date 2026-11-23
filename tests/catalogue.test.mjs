import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { test } from 'node:test';
import { catalogueGroups, frameHref, frames, photoSrc } from '../src/lib/catalogue.ts';
import { studio, whatsappEnquiry } from '../src/lib/studio.ts';

const publicRoot = new URL('../public/', import.meta.url);

test('the catalogue groups distinct frames with stable routes and enquiry references', () => {
  assert.deepEqual(catalogueGroups.flatMap(({ frames: entries }) => entries.map(({ id }) => id)).sort(), frames.map(({ id }) => id).sort());
  assert.ok(catalogueGroups.every(({ frames: entries }) => entries.length > 0));
  assert.equal(new Set(frames.map(frameHref)).size, frames.length);
  assert.equal(new Set(frames.map(({ code }) => code)).size, frames.length);
  for (const frame of frames) {
    assert.match(frameHref(frame), /^\/frames\/[a-z0-9-]+\/$/u);
    assert.match(frame.code, /^VH-\d+$/u);
  }
});

test('each selectable view has a descriptive alt, a full photo and an optimised thumbnail', () => {
  for (const frame of frames) {
    assert.ok(frame.photos.length > 0);
    assert.equal(new Set(frame.photos.map(({ view }) => view)).size, frame.photos.length);
    for (const photo of frame.photos) {
      assert.ok(photo.alt.length > 0);
      const full = statSync(new URL(photoSrc(frame, photo).slice(1), publicRoot));
      const thumb = statSync(new URL(photoSrc(frame, photo, true).slice(1), publicRoot));
      assert.ok(full.isFile() && thumb.isFile());
      assert.ok(thumb.size > 0 && thumb.size < full.size);
    }
  }
});

test('WhatsApp links reuse the store number and include the selected frame without a price', () => {
  const rawNumber = studio.phoneHref.replace('tel:+', '');
  const generic = new URL(whatsappEnquiry());
  assert.equal(generic.origin, 'https://wa.me');
  assert.equal(generic.pathname, `/${rawNumber}`);
  assert.match(generic.searchParams.get('text'), /help choosing a frame/u);
  const sample = { name: 'Navy & Silver', code: 'VH-01' };
  assert.equal(new URL(whatsappEnquiry(sample)).searchParams.get('text'), "Hi Vision Hub Kota! I'm interested in Navy & Silver (VH-01). Is it available to try on?");
  for (const frame of frames) {
    const url = new URL(whatsappEnquiry(frame));
    assert.equal(url.pathname, generic.pathname);
    const message = url.searchParams.get('text');
    assert.ok(message.includes(frame.name) && message.includes(frame.code));
    assert.doesNotMatch(message, /(?:₹|Rs\.?\s*\d|\bINR\b)/u);
  }
});
