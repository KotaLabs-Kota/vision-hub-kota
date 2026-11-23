for (const gallery of document.querySelectorAll<HTMLElement>('[data-frame-gallery]')) {
  const image = gallery.querySelector<HTMLImageElement>('#frame-photo');
  const label = gallery.querySelector('[data-photo-label]');
  const full = gallery.querySelector<HTMLAnchorElement>('[data-photo-full]');
  const views = gallery.querySelectorAll<HTMLAnchorElement>('[data-photo-view]');
  if (!image || !label || !full || !views.length) continue;

  for (const view of views) {
    view.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (view.hasAttribute('aria-current')) return;

      image.src = view.href;
      image.alt = view.dataset.photoAlt ?? '';
      label.textContent = `${view.dataset.photoView} view`;
      full.href = view.href;
      for (const other of views) other.removeAttribute('aria-current');
      view.setAttribute('aria-current', 'true');
    });
  }
}
