import { reelDuration, reelNumber } from './reel-format.mjs';

const gallery = document.querySelector('[data-reel-gallery]');
const video = gallery?.querySelector<HTMLVideoElement>('[data-reel-video]');
const error = gallery?.querySelector<HTMLElement>('[data-reel-error]');
const stage = gallery?.querySelector<HTMLElement>('#vision-reel-player');

if (gallery && video && error && stage) {
  const picks = [...gallery.querySelectorAll<HTMLButtonElement>('[data-reel-pick]')];
  const counter = gallery.querySelector('[data-reel-counter]');
  const status = gallery.querySelector('[data-reel-status]');
  let current = 0;

  const showError = () => {
    const wasFocused = document.activeElement === video;
    video.hidden = true;
    error.hidden = false;
    if (wasFocused) error.querySelector('a')?.focus();
    if (status) status.textContent = 'This clip couldn’t load. Watch on Instagram instead.';
  };
  video.addEventListener('error', showError);
  if (video.error) showError();

  const showDuration = () => {
    const label = picks[current]?.querySelector<HTMLElement>('[data-reel-duration]');
    const duration = reelDuration(video.duration);
    if (label && duration) {
      label.textContent = duration;
      label.hidden = false;
    }
  };
  video.addEventListener('loadedmetadata', showDuration);
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) showDuration();

  const selectReel = (index: number) => {
    const pick = picks[index];
    if (!pick) return;
    const { title = 'Vision Hub Reel', poster, captions, src } = pick.dataset;
    if (!src || (index === current && !video.error)) return;
    current = index;
    video.pause();
    video.muted = true;
    video.hidden = false;
    error.hidden = true;
    if (poster) video.poster = poster;
    else video.removeAttribute('poster');
    video.querySelector('track')?.remove();
    if (captions) {
      const track = document.createElement('track');
      track.kind = 'captions';
      track.srclang = 'en';
      track.label = 'English';
      track.src = captions;
      video.append(track);
    }
    video.setAttribute('aria-label', title);
    video.src = src;
    picks.forEach((item, position) => item.setAttribute('aria-pressed', String(position === index)));
    if (counter) counter.textContent = `${reelNumber(index + 1)} / ${reelNumber(picks.length)}`;
    if (status) status.textContent = `Reel ${index + 1} of ${picks.length}: ${title}`;
  };

  picks.forEach((pick, index) => pick.addEventListener('click', () => {
    selectReel(index);
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    const top = stage.getBoundingClientRect().top;
    if (top < headerBottom || top > window.innerHeight - 140) {
      stage.scrollIntoView({ block: 'start' });
      video.focus({ preventScroll: true });
    }
    void video.play().catch(() => {
      // A browser can still deny playback. Leave the native play control available.
    });
  }));
  gallery.querySelectorAll<HTMLButtonElement>('[data-reel-step]').forEach((button) => {
    button.addEventListener('click', () => selectReel((current + Number(button.dataset.reelStep) + picks.length) % picks.length));
  });
}
