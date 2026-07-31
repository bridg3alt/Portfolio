// Subtle film-grain for a tactile, premium surface. Fixed, non-interactive, low opacity.
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`,
  );

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] opacity-[0.04]"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "180px 180px",
        mixBlendMode: "overlay",
      }}
    />
  );
}
