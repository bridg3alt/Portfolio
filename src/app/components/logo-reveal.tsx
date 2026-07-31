import { motion } from "motion/react";

// Original logo geometry (viewBox 0 0 1254 1254). The three white shapes are the
// two curved bowls of the "B" plus the circular dot. They begin as independent
// elements rotating around an invisible axis with subtle depth, then align.
const CENTER = 627;

// Fluid, futuristic ease — soft in, precise decelerating settle (no bounce).
const EASE = [0.4, 0, 0.15, 1] as const;
// ~2s is the sweet spot for a hero-page logo intro: premium but never in the way.
const DURATION = 2;

type Piece = {
  id: string;
  d: string;
  fromRotate: number; // in-plane rotation around the logo center (deg)
  fromRotateY: number; // out-of-plane depth tilt (deg)
  fromOffset: [number, number]; // radial float offset (view-box units)
};

const pieces: Piece[] = [
  {
    // Lower bowl — rotates clockwise
    id: "lower",
    d: "M470.321 617.27L525.327 617.24C566.039 617.246 605.322 617.24 641.199 640.054C712.478 685.377 718.619 783.903 660.799 842.758C660.505 843.07 660.211 843.37 659.911 843.67C624.177 879.202 572.464 880.69 525.75 880.684L470.314 880.647L470.321 617.27Z",
    fromRotate: 300,
    fromRotateY: 55,
    fromOffset: [50, 200],
  },
  {
    // Upper bowl — rotates counter-clockwise (opposite direction)
    id: "upper",
    d: "M477.587 343.207L528.806 343.168C571.633 343.211 617.025 344.829 646.851 381.02C661.203 398.441 668.012 420.866 665.777 443.326C663.303 467.484 652.423 487.53 633.711 502.855C600.22 527.803 564.232 527.368 524.945 527.377L470.329 527.31L470.318 343.281L477.587 343.207Z",
    fromRotate: -300,
    fromRotateY: -55,
    fromOffset: [-50, -200],
  },
  {
    // Dot — counter-rotates on its own axis
    id: "dot",
    d: "M884.609 808.751C909.762 806.167 932.228 824.511 934.72 849.671C937.218 874.83 918.794 897.235 893.622 899.641C868.579 902.041 846.309 883.727 843.829 858.684C841.343 833.647 859.578 811.316 884.609 808.751Z",
    fromRotate: -220,
    fromRotateY: 45,
    fromOffset: [190, 50],
  },
];

export function LogoReveal({ size = 360 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 1254 1254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ perspective: "1200px", transformOrigin: "center" }}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{
        duration: 1.1,
        delay: DURATION,
        ease: [0.4, 0, 0.2, 1],
        times: [0, 0.5, 1],
      }}
    >
      {/* No stage rect: the section behind supplies the black, so the SVG has
          no visible square edge and blends into the page. */}
      {pieces.map((p) => (
        <motion.g
          key={p.id}
          style={{
            transformBox: "view-box",
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transformStyle: "preserve-3d",
          }}
          initial={{ rotate: p.fromRotate, rotateY: p.fromRotateY, opacity: 0 }}
          animate={{ rotate: 0, rotateY: 0, opacity: 1 }}
          transition={{
            rotate: { duration: DURATION, ease: EASE },
            rotateY: { duration: DURATION, ease: EASE },
            opacity: { duration: 0.5, ease: "easeOut" },
          }}
        >
          <motion.path
            d={p.d}
            fill="#FEFEFE"
            initial={{ x: p.fromOffset[0], y: p.fromOffset[1] }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: DURATION, ease: EASE }}
          />
        </motion.g>
      ))}

      {/* Thin black outline of the B — fades in only after the shapes snap together */}
      <motion.g
        fill="none"
        stroke="#090908"
        strokeWidth={5}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: DURATION - 0.05, ease: "easeInOut" }}
      >
        {pieces.map((p) => (
          <path key={p.id} d={p.d} />
        ))}
      </motion.g>
    </motion.svg>
  );
}
