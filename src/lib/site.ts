import { filters, frames, searchPages } from './studio';

const frameById = new Map(frames.map((frame) => [frame.id, frame]));
const categoryLabel = new Map<string, string>(filters.map((filter) => [filter.key, filter.label]));
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
const frameDialog = document.querySelector<HTMLDialogElement>('#frame-dialog');
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

function showFrame(id: string) {
  const frame = frameById.get(id);
  if (!frame || !frameDialog) return;
  const image = frameDialog.querySelector<HTMLImageElement>('#frame-dialog-image');
  if (image) {
    image.src = frame.image;
    image.alt = frame.alt;
  }
  text('frame-dialog-category', categoryLabel.get(frame.category) ?? frame.category);
  text('frame-dialog-title', frame.name);
  text('frame-dialog-meta', `${frame.shape} · ${frame.material} · ${frame.finish}`);
  text('frame-dialog-description', frame.description);
  const save = frameDialog.querySelector<HTMLButtonElement>('[data-save-current]');
  if (save) {
    save.dataset.saveFrame = frame.id;
    save.setAttribute('aria-pressed', String(saved.has(frame.id)));
  }
  openDialog(frameDialog);
}

function resultRow(name: string, detail: string, action: { href: string; filter?: string } | { frameId: string }) {
  const row = document.createElement('div');
  row.className = 'panel-row';
  const label = document.createElement('span');
  label.textContent = name;
  const caption = document.createElement('small');
  caption.textContent = detail;
  label.append(caption);
  if ('href' in action) {
    const link = document.createElement('a');
    link.className = 'panel-result';
    link.href = action.href;
    if (action.filter) link.dataset.setFilter = action.filter;
    link.append(label);
    row.append(link);
  } else {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'panel-result';
    button.dataset.openFrame = action.frameId;
    button.setAttribute('aria-haspopup', 'dialog');
    const frame = frameById.get(action.frameId);
    if (frame) {
      const image = document.createElement('img');
      image.src = frame.image;
      image.alt = '';
      image.width = 57;
      image.height = 40;
      button.append(image);
    }
    button.append(label);
    row.append(button);
  }
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
  const results = searchPages
    .filter((page) => matches(`${page.name} ${page.detail} ${page.terms}`))
    .map((page) => resultRow(page.name, page.detail, page));
  if (words.length) {
    results.unshift(...frames
      .filter((frame) => matches(`${frame.name} ${frame.category} ${frame.shape} ${frame.material} ${frame.finish}`))
      .map((frame) => resultRow(frame.name, `${frame.shape} · ${categoryLabel.get(frame.category)}`, { frameId: frame.id })));
  }
  searchResults.replaceChildren(...(results.length ? results : [emptyMessage('No results. Try “frames”, “eye test” or “directions”.')]));
  text('search-status', words.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular searches');
}

function renderSaved() {
  if (!savedResults) return;
  const rows = frames.filter((frame) => saved.has(frame.id)).map((frame) => {
    const row = resultRow(frame.name, `${frame.shape} · ${categoryLabel.get(frame.category)}`, { frameId: frame.id });
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

function setFilter(key: string) {
  if (!categoryLabel.has(key)) return;
  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === key));
  });
  let count = 0;
  document.querySelectorAll<HTMLElement>('[data-frame-card]').forEach((card) => {
    card.hidden = key !== 'all' && key !== card.dataset.frameCard;
    if (!card.hidden) count += 1;
  });
  text('frame-status', `${categoryLabel.get(key)}: ${count} styles shown.`);
}

updateSaveControls();
window.addEventListener('storage', (event) => {
  if (event.key === storageKey || event.key === null) {
    saved = readSaved();
    updateSaveControls();
  }
});
searchInput?.addEventListener('input', () => renderSearch());

const dialogList = [searchDialog, savedDialog, frameDialog, menuDialog];
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
  const { dialogOpen, openFrame, saveFrame, removeFrame, setFilter: selectedFilter, filter } = control.dataset;
  if (dialogOpen) {
    const dialog = dialogList.find((item) => item?.id === dialogOpen);
    if (!dialog) return;
    if (dialog === searchDialog) renderSearch();
    if (dialog === savedDialog) renderSaved();
    openDialog(dialog);
  }
  if (openFrame) showFrame(openFrame);
  if (saveFrame) toggleFrame(saveFrame);
  if (removeFrame && saved.has(removeFrame)) {
    toggleFrame(removeFrame);
    (savedResults?.querySelector<HTMLElement>('[data-remove-frame]') ?? savedDialog?.querySelector<HTMLElement>('.panel-close button'))?.focus();
  }
  if (selectedFilter || filter) setFilter(selectedFilter ?? filter ?? 'all');
  if (control instanceof HTMLAnchorElement && control.getAttribute('href')?.startsWith('#')) {
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
