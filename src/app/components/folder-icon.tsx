type Props = {
  tint?: string;
  paper?: string;
  className?: string;
};

export function FolderIcon({
  tint = "#373431",
  paper,
  className,
}: Props) {
  const back = `color-mix(in srgb, ${tint} 75%, #ffffff)`;
  const front = tint;
  const frontDeep = `color-mix(in srgb, ${tint} 55%, #211F1D)`;
  const paperTop = paper
    ? `color-mix(in srgb, ${paper} 80%, #ffffff)`
    : `color-mix(in srgb, ${tint} 12%, #ffffff)`;
  const paperBot = paper ?? `color-mix(in srgb, ${tint} 28%, #ffffff)`;
  const paperLine = paper
    ? `color-mix(in srgb, ${paper} 55%, ${tint})`
    : `color-mix(in srgb, ${tint} 45%, #ffffff)`;
  const paperStroke = paper
    ? `color-mix(in srgb, ${paper} 60%, ${tint})`
    : `color-mix(in srgb, ${tint} 35%, #ffffff)`;
  const uid = `${tint}${paper ?? ""}`.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={`back-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={back} />
          <stop offset="1" stopColor={tint} />
        </linearGradient>
        <linearGradient id={`front-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={front} />
          <stop offset="1" stopColor={frontDeep} />
        </linearGradient>
        <linearGradient id={`paper-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={paperTop} />
          <stop offset="1" stopColor={paperBot} />
        </linearGradient>
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* back of folder + tab */}
      <path
        d="M4 16 H36 a4 4 0 0 1 3.2 1.6 L43 22 H92 a4 4 0 0 1 4 4 V70 a4 4 0 0 1 -4 4 H8 a4 4 0 0 1 -4 -4 Z"
        fill={`url(#back-${uid})`}
      />
      {/* paper peeking out */}
      <rect
        x="14"
        y="24"
        width="72"
        height="34"
        rx="2"
        fill={`url(#paper-${uid})`}
        stroke={paperStroke}
        strokeWidth="0.6"
      />
      {/* paper detail lines */}
      <g
        stroke={paperLine}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.8"
      >
        <line x1="20" y1="32" x2="62" y2="32" />
        <line x1="20" y1="38" x2="74" y2="38" />
        <line x1="20" y1="44" x2="56" y2="44" />
      </g>
      {/* front pocket */}
      <path
        d="M4 34 H96 V70 a4 4 0 0 1 -4 4 H8 a4 4 0 0 1 -4 -4 Z"
        fill={`url(#front-${uid})`}
      />
      {/* gloss */}
      <path
        d="M4 34 H96 V52 H4 Z"
        fill={`url(#gloss-${uid})`}
      />
      {/* top edge highlight */}
      <path
        d="M4 34 H96 V35.5 H4 Z"
        fill="rgba(255,255,255,0.55)"
      />
    </svg>
  );
}
