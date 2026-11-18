/** @param {number} value */
export const reelNumber = (value) => String(value).padStart(2, '0');

/** @param {unknown} seconds */
export function reelDuration(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  // Use whole elapsed seconds, the same convention as the native controls.
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${reelNumber(whole % 60)}`;
}
