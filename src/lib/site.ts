import { catalogueGroups, frameHref, frames, photoSrc } from './catalogue';
import { searchPages } from './studio';

const frameById = new Map(frames.map((frame) => [frame.id, frame]));
const cataloguePages = catalogueGroups.map((group) => ({ name: group.name, detail: group.description, href: `/#${group.id}`, terms: 'frames eyeglasses specs' }));
const storageKey = 'vision-hub-saved-frames';
const pad = (value: number) => String(value).padStart(2, '0');

function readSaved(): Set<string> {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string' && frameById.has(id)) : []);
  } catch {
    return new Set();
  }
}

let saved = readSaved();
const savedDialog = document.querySelector<HTMLDialogElement>('#saved-dialog');
const searchDialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const menuDialog = document.querySelector<HTMLDialogElement>('#menu-dialog');
const searchInput = document.querySelector<HTMLInputElement>('#site-search');
const searchResults = document.querySelector('#search-results');
const savedResults = document.querySelector('#saved-results');

function text(id: string, content: string) {
  const target = document.getElementById(id);
  if (target) target.textContent = content;
}

function openDialog(dialog: HTMLDialogElement) {
  if (dialog.open) return;
  document.querySelector<HTMLDialogElement>('dialog[open]')?.close();
  dialog.showModal();
}

function resultRow(name: string, detail: string, href: string, photo?: string) {
  const row = document.createElement('div');
  row.className = 'panel-row';
  const link = document.createElement('a');
  link.className = 'panel-result';
  link.href = href;
  if (photo) {
    const image = document.createElement('img');
    image.src = photo;
    image.alt = '';
    image.width = 57;
    image.height = 32;
    link.append(image);
  }
  const label = document.createElement('span');
  label.textContent = name;
  const caption = document.createElement('small');
  caption.textContent = detail;
  label.append(caption);
  link.append(label);
  row.append(link);
  return row;
}

function emptyMessage(message: string) {
  const paragraph = document.createElement('p');
  paragraph.className = 'panel-empty';
  paragraph.textContent = message;
  return paragraph;
}

function renderSearch(query = searchInput?.value ?? '') {
  if (!searchResults) return;
  const words = query.toLowerCase().trim().split(/\s+/u).filter(Boolean);
  const matches = (value: string) => words.every((word) => value.toLowerCase().includes(word));
  const results = [...searchPages, ...cataloguePages]
    .filter((page) => matches(`${page.name} ${page.detail} ${page.terms}`))
    .map((page) => resultRow(page.name, page.detail, page.href));
  if (words.length) {
    results.unshift(...frames
      .filter((frame) => matches(`${frame.name} ${frame.code} ${frame.section.replaceAll('-', ' ')} ${frame.shape} ${frame.finish} eyeglasses specs`))
      .map((frame) => resultRow(frame.name, `${frame.code} · ${frame.finish}`, frameHref(frame), photoSrc(frame, frame.photos[0], true))));
  }
  searchResults.replaceChildren(...(results.length ? results : [emptyMessage('No results. Try “frames”, “eye test” or “directions”.')]));
  text('search-status', words.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular searches');
}

function renderSaved() {
  if (!savedResults) return;
  const rows = frames.filter((frame) => saved.has(frame.id)).map((frame) => {
    const row = resultRow(frame.name, `${frame.code} · ${frame.finish}`, frameHref(frame), photoSrc(frame, frame.photos[0], true));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${frame.name} from saved frames`);
    remove.className = 'panel-remove';
    remove.dataset.removeFrame = frame.id;
    row.append(remove);
    return row;
  });
  savedResults.replaceChildren(...(rows.length ? rows : [emptyMessage('No saved frames yet. Tap the heart on any style to add it here.')]));
}

function updateSaveControls() {
  document.querySelectorAll<HTMLButtonElement>('[data-save-frame]').forEach((button) => {
    button.setAttribute('aria-pressed', String(saved.has(button.dataset.saveFrame ?? '')));
  });
  document.querySelectorAll<HTMLElement>('[data-saved-count]').forEach((badge) => {
    badge.textContent = String(saved.size);
    badge.hidden = saved.size === 0;
  });
  if (savedDialog?.open) renderSaved();
}

function toggleFrame(id: string) {
  const frame = frameById.get(id);
  if (!frame) return;
  const removing = saved.has(id);
  if (removing) saved.delete(id);
  else saved.add(id);
  try {
    localStorage.setItem(storageKey, JSON.stringify([...saved]));
  } catch {
    // The shortlist still works for the current page when storage is disabled.
  }
  updateSaveControls();
  text('saved-status', removing ? `${frame.name} removed from saved frames.` : `${frame.name} added to saved frames.`);
}

updateSaveControls();
window.addEventListener('storage', (event) => {
  if (event.key === storageKey || event.key === null) {
    saved = readSaved();
    updateSaveControls();
  }
});
searchInput?.addEventListener('input', () => renderSearch());

const dialogList = [searchDialog, savedDialog, menuDialog];
for (const dialog of dialogList) {
  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const area = dialog.getBoundingClientRect();
    if (event.clientX < area.left || event.clientX > area.right || event.clientY < area.top || event.clientY > area.bottom) dialog.close();
  });
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const control = event.target.closest<HTMLElement>('button, a');
  if (!control) return;
  const { dialogOpen, saveFrame, removeFrame } = control.dataset;
  if (dialogOpen) {
    const dialog = dialogList.find((item) => item?.id === dialogOpen);
    if (!dialog) return;
    if (dialog === searchDialog) renderSearch();
    if (dialog === savedDialog) renderSaved();
    openDialog(dialog);
  }
  if (saveFrame) toggleFrame(saveFrame);
  if (removeFrame && saved.has(removeFrame)) {
    toggleFrame(removeFrame);
    (savedResults?.querySelector<HTMLElement>('[data-remove-frame]') ?? savedDialog?.querySelector<HTMLElement>('.panel-close button'))?.focus();
  }
  // Close on regular navigation so anchor links and the Back button don't leave a dialog open.
  if (control instanceof HTMLAnchorElement && !control.target && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    control.closest<HTMLDialogElement>('dialog[open]')?.close();
  }
});

const faceOptions = [...document.querySelectorAll<HTMLButtonElement>('[data-fit]')];
const faceTips = [...document.querySelectorAll<HTMLElement>('[data-fit-tip]')];
for (const option of faceOptions) {
  option.addEventListener('click', () => {
    faceOptions.forEach((button) => button.setAttribute('aria-pressed', String(option === button)));
    faceTips.forEach((tip) => { tip.hidden = tip.dataset.fitTip !== option.dataset.fit; });
  });
}

const reviewCarousel = document.querySelector('[data-review-carousel]');
if (reviewCarousel) {
  const quotes = [...reviewCarousel.querySelectorAll<HTMLElement>('[data-review]')];
  const counter = reviewCarousel.querySelector('[data-review-counter]');
  let current = 0;
  reviewCarousel.querySelectorAll<HTMLButtonElement>('[data-review-step]').forEach((button) => {
    button.addEventListener('click', () => {
      current = (current + Number(button.dataset.reviewStep) + quotes.length) % quotes.length;
      quotes.forEach((quote, index) => { quote.hidden = index !== current; });
      if (counter) counter.textContent = `${pad(current + 1)} / ${pad(quotes.length)}`;
    });
  });
}
