/**
 * Podium-style "pixel" hover: a tiny stepped jitter + flicker instead of a
 * smooth scale, so links/icons feel like they snap rather than glide.
 * Spread into a Framer `whileHover` prop.
 */
export const pixelHover = {
  x: [0, -1.5, 1.5, -1, 0],
  y: [0, 1, -1, 0.5, 0],
  opacity: [1, 0.7, 1, 0.85, 1],
  transition: { duration: 0.26, ease: "linear" as const },
};
