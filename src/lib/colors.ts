/**
 * Deterministic color from a string (userId, etc).
 * Returns an HSL string with good saturation/lightness for cursor labels.
 */
export function userColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = ((hash % 360) + 360) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
