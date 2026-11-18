/** @param {number} value */
export const reelNumber = (value) => String(value).padStart(2, '0');

/** @param {unknown} seconds */
export function reelDuration(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  const rounded = Math.max(1, Math.round(seconds));
  return `${Math.floor(rounded / 60)}:${reelNumber(rounded % 60)}`;
}
