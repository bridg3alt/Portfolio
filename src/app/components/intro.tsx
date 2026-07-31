import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { pixelHover } from "./pixel-hover";
import bImg from "../../imports/B.png";

// Social handles shown top-right. Drop your real profile URLs into href.
const SOCIALS = [
  { label: "GitHub", href: "#", Icon: Github },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Email", href: "mailto:brigitmanjooran@gmail.com", Icon: Mail },
];

/* ------------------------------------------------------------------ *
 * Jigsaw B — pieces show blue backs while scattered; one click flips
 * + assembles them into the crisp collage. Assembled, the collage is
 * blurred and sharpens under the cursor. Scrolling parallax-drifts the
 * pieces apart to reveal the portfolio.
 * ------------------------------------------------------------------ */
const COLS = 5;
const ROWS = 6;
const KNOB = 0.18; // knob radius as a fraction of the smaller cell side
// resting blur of the assembled collage (0 = entire B fully clear on click).
// Bump to ~6 to bring back the "blurred by default, sharpen on hover" look.
const RESTING_BLUR = 0;

type Vec = [number, number];
type Edge = { border: boolean; sign: number }; // sign = +1 tab outward, -1 blank

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;
const f = (n: number) => n.toFixed(2);
const pt = (p: Vec) => `${f(p[0])} ${f(p[1])}`;

// Random ±1 tab/blank signs for every internal grid edge (stable per puzzle).
function genSigns() {
  const h: number[][] = []; // h[r][c], r = 1..ROWS-1 (edge between r-1 and r)
  for (let r = 1; r < ROWS; r++) {
    h[r] = [];
    for (let c = 0; c < COLS; c++) h[r][c] = Math.random() < 0.5 ? 1 : -1;
  }
  const v: number[][] = []; // v[c][r], c = 1..COLS-1 (edge between c-1 and c)
  for (let c = 1; c < COLS; c++) {
    v[c] = [];
    for (let r = 0; r < ROWS; r++) v[c][r] = Math.random() < 0.5 ? 1 : -1;
  }
  return { h, v };
}

// One edge from p0 -> p1. `n` is the outward unit normal. Straight if border,
// otherwise a semicircular knob (bulge = sign * outward) that interlocks with
// the neighbour sharing the identical world curve.
function edgeCmd(p0: Vec, p1: Vec, n: Vec, edge: Edge, kr: number) {
  if (edge.border) return `L ${pt(p1)}`;
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const L = Math.hypot(dx, dy);
  const d: Vec = [dx / L, dy / L];
  const b = edge.sign;
  const nb: Vec = [n[0] * b, n[1] * b];
  const A: Vec = [p0[0] + d[0] * (L / 2 - kr), p0[1] + d[1] * (L / 2 - kr)];
  const C: Vec = [p0[0] + d[0] * (L / 2 + kr), p0[1] + d[1] * (L / 2 + kr)];
  const M: Vec = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
  const P: Vec = [M[0] + nb[0] * kr, M[1] + nb[1] * kr]; // knob apex
  const cc = kr * 0.5523; // cubic approximation of a quarter circle
  const c1: Vec = [A[0] + nb[0] * cc, A[1] + nb[1] * cc];
  const c2: Vec = [P[0] - d[0] * cc, P[1] - d[1] * cc];
  const c3: Vec = [P[0] + d[0] * cc, P[1] + d[1] * cc];
  const c4: Vec = [C[0] + nb[0] * cc, C[1] + nb[1] * cc];
  return `L ${pt(A)} C ${pt(c1)} ${pt(c2)} ${pt(P)} C ${pt(c3)} ${pt(c4)} ${pt(
    C,
  )} L ${pt(p1)}`;
}

type Geom = {
  left: string;
  top: string;
  width: string;
  height: string;
  clip: string;
  bgSize: string;
  bgPos: string;
};

function buildPieces(
  w: number,
  h: number,
  signs: { h: number[][]; v: number[][] },
): Geom[] {
  const cellW = w / COLS;
  const cellH = h / ROWS;
  const kr = KNOB * Math.min(cellW, cellH);
  const out: Geom[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellX = c * cellW;
      const cellY = r * cellH;
      const ox = cellX - kr;
      const oy = cellY - kr;
      // corners in the piece's local box (cell padded by kr on all sides)
      const TL: Vec = [kr, kr];
      const TR: Vec = [kr + cellW, kr];
      const BR: Vec = [kr + cellW, kr + cellH];
      const BL: Vec = [kr, kr + cellH];

      const top: Edge =
        r === 0 ? { border: true, sign: 0 } : { border: false, sign: -signs.h[r][c] };
      const bottom: Edge =
        r === ROWS - 1
          ? { border: true, sign: 0 }
          : { border: false, sign: signs.h[r + 1][c] };
      const left: Edge =
        c === 0 ? { border: true, sign: 0 } : { border: false, sign: -signs.v[c][r] };
      const right: Edge =
        c === COLS - 1
          ? { border: true, sign: 0 }
          : { border: false, sign: signs.v[c + 1][r] };

      const path =
        `M ${pt(TL)} ` +
        edgeCmd(TL, TR, [0, -1], top, kr) + " " +
        edgeCmd(TR, BR, [1, 0], right, kr) + " " +
        edgeCmd(BR, BL, [0, 1], bottom, kr) + " " +
        edgeCmd(BL, TL, [-1, 0], left, kr) + " Z";

      out.push({
        left: `${ox}px`,
        top: `${oy}px`,
        width: `${cellW + 2 * kr}px`,
        height: `${cellH + 2 * kr}px`,
        clip: `path('${path}')`,
        bgSize: `${w}px ${h}px`,
        bgPos: `${-ox}px ${-oy}px`,
      });
    }
  }
  return out;
}

type Meta = {
  scatter: { x: number; y: number; rotate: number; scale: number };
  fall: { x: number; rot: number; dist: number }; // scroll-down: drop into next page
  delay: number;
  threshold: number; // boot-loader fraction (0..1) at which this piece locks in
  cx: number; // piece centre, fraction of box
  cy: number;
};

function genMeta(): Meta[] {
  const out: Meta[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = (c + 0.5) / COLS;
      const cy = (r + 0.5) / ROWS;
      out.push({
        // scattered all across the screen, then they fly in to assemble
        scatter: {
          x: rand(-900, 900),
          y: rand(-520, 520),
          rotate: rand(-180, 180),
          scale: rand(0.3, 1),
        },
        // on scroll: scatter wide across the screen, then fall onto the next page
        fall: { x: rand(-600, 600), rot: rand(-180, 180), dist: rand(520, 1100) },
        delay: Math.random() * 0.4,
        threshold: rand(0, 0.92),
        cx,
        cy,
      });
    }
  }
  return out;
}

const Piece = memo(function Piece({
  src,
  geom,
  meta,
  assembled,
  hoverable,
  mx,
  my,
  scrollYProgress,
  rounded,
}: {
  src: string;
  geom: Geom;
  meta: Meta;
  assembled: boolean;
  hoverable: boolean; // hover push-aside active once the B has settled
  mx: MotionValue<number>;
  my: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  rounded?: boolean; // the dot uses a circular clip
}) {
  // scroll-down: the piece falls into the next page (accelerating) + spins + fades
  const py = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8],
    [0, meta.fall.dist * 0.12, meta.fall.dist],
  );
  const px = useTransform(scrollYProgress, [0, 0.8], [0, meta.fall.x]);
  const prot = useTransform(scrollYProgress, [0, 0.8], [0, meta.fall.rot]);
  const pop = useTransform(scrollYProgress, [0.45, 0.8], [1, 0]);

  // hover: the pieces nearest the cursor slide AWAY from their spot + magnify;
  // only those "selected" pieces react. Off once the scatter/fall begins.
  const HOVER_R = 0.22; // influence radius (box fraction)
  const force = () => {
    if (!hoverable || !assembled) return 0;
    if (scrollYProgress.get() > 0.08) return 0;
    const dx = meta.cx - mx.get();
    const dy = meta.cy - my.get();
    const d = Math.hypot(dx, dy);
    if (d >= HOVER_R) return 0;
    return 1 - d / HOVER_R;
  };
  const hxRaw = useTransform(() => {
    const f = force();
    if (f <= 0) return 0;
    const dx = meta.cx - mx.get();
    const d = Math.hypot(dx, meta.cy - my.get()) || 1;
    return (dx / d) * f * 55; // push outward, away from cursor
  });
  const hyRaw = useTransform(() => {
    const f = force();
    if (f <= 0) return 0;
    const dy = meta.cy - my.get();
    const d = Math.hypot(meta.cx - mx.get(), dy) || 1;
    return (dy / d) * f * 55;
  });
  const hsRaw = useTransform(() => 1 + force() * 0.22);
  const hx = useSpring(hxRaw, { stiffness: 320, damping: 26 });
  const hy = useSpring(hyRaw, { stiffness: 320, damping: 26 });
  const hscale = useSpring(hsRaw, { stiffness: 320, damping: 26 });

  // hover blur/reveal — resting blur = RESTING_BLUR (0 keeps the whole B clear),
  // sharpening near the cursor; eases off as scroll begins.
  const blur = useTransform(() => {
    if (!assembled || RESTING_BLUR === 0) return 0;
    const dx = mx.get() - meta.cx;
    const dy = my.get() - meta.cy;
    const d = Math.hypot(dx, dy);
    const reveal = clamp((0.26 - d) / 0.26, 0, 1); // near cursor -> 1
    const sp = scrollYProgress.get();
    return (1 - reveal) * RESTING_BLUR * (1 - clamp(sp / 0.2, 0, 1));
  });
  const filter = useMotionTemplate`blur(${blur}px)`;

  const clip = rounded ? "circle(46%)" : geom.clip;

  return (
    <motion.div
      className="absolute"
      style={{
        left: geom.left,
        top: geom.top,
        width: geom.width,
        height: geom.height,
        x: px,
        y: py,
        rotate: prot,
        opacity: pop,
        willChange: "transform, opacity",
      }}
    >
      {/* hover: push aside + magnify the selected pieces */}
      <motion.div
        style={{ width: "100%", height: "100%", x: hx, y: hy, scale: hscale, willChange: "transform" }}
      >
      {/* mid: scatter <-> assemble */}
      <motion.div
        style={{ width: "100%", height: "100%", perspective: 800 }}
        initial={{
          opacity: 0,
          x: meta.scatter.x,
          y: meta.scatter.y,
          rotate: meta.scatter.rotate,
          scale: meta.scatter.scale,
        }}
        animate={
          assembled
            ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
            : {
                opacity: 1,
                x: meta.scatter.x,
                y: meta.scatter.y,
                rotate: meta.scatter.rotate,
                scale: meta.scatter.scale,
              }
        }
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 20,
          delay: assembled ? meta.delay : meta.delay * 0.3,
          opacity: { duration: 0.6, delay: meta.delay * 0.3 },
        }}
      >
        {/* flip: blue back -> photo front */}
        <motion.div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
          initial={{ rotateY: 180 }}
          animate={{ rotateY: assembled ? 0 : 180 }}
          transition={{
            type: "spring",
            stiffness: 95,
            damping: 18,
            delay: assembled ? meta.delay + 0.05 : 0,
          }}
        >
          {/* front (photo) — filter lives on an inner div so it doesn't break
              backface-visibility on the 3D face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              clipPath: clip,
              WebkitClipPath: clip,
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${src})`,
                backgroundSize: rounded ? "contain" : geom.bgSize,
                backgroundPosition: rounded ? "center" : geom.bgPos,
                backgroundRepeat: "no-repeat",
                filter,
              }}
            />
          </div>
          {/* back (brand blue) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              clipPath: clip,
              WebkitClipPath: clip,
              background:
                "linear-gradient(150deg, color-mix(in srgb, var(--brand) 88%, #fff) 0%, var(--brand) 55%, var(--brand-deep) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
            }}
          />
        </motion.div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
});


/* ------------------------------------------------------------------ *
 * SprayOverlay — a transparent 2D canvas over the pieces. A blue
 * aerosol trail follows the cursor and dissipates over time. No WebGL.
 * ------------------------------------------------------------------ */
function SprayOverlay({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    // --brand / --brand-deep / --brand-soft
    const COLORS = ["55,52,49", "107,101,94", "162,156,147"];
    let last = { x: -1, y: -1 };

    const splat = (x: number, y: number, strength: number) => {
      const rad = (10 + strength * 16) * dpr;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, "rgba(55,52,49,0.20)");
      g.addColorStop(1, "rgba(55,52,49,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
      const n = 6 + Math.floor(strength * 8);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = Math.random() * rad * 0.9;
        const sr = (0.6 + Math.random() * 1.7) * dpr;
        ctx.fillStyle = `rgba(${COLORS[(Math.random() * COLORS.length) | 0]},${
          0.25 + Math.random() * 0.5
        })`;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      // dissipate the existing paint
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      const x = mx.get() * canvas.width;
      const y = my.get() * canvas.height;
      if (last.x >= 0) {
        const dx = x - last.x;
        const dy = y - last.y;
        const moved = Math.hypot(dx, dy);
        if (moved > 1.5 * dpr) {
          // stamp along the path so fast moves stay continuous
          const steps = Math.min(6, Math.max(1, Math.floor(moved / (8 * dpr))));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            splat(last.x + dx * t, last.y + dy * t, clamp(moved / (40 * dpr), 0.2, 1));
          }
        }
      }
      last = { x, y };
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mx, my]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}

function PuzzleB({
  scrollYProgress,
  onEnter,
}: {
  scrollYProgress: MotionValue<number>;
  onEnter?: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pct, setPct] = useState(0); // boot-loader 0..100
  const [settled, setSettled] = useState(false); // pieces finished assembling
  const doneRef = useRef(false);
  // off-field until the pointer actually enters, so nothing is pushed at rest
  const mx = useMotionValue(-1);
  const my = useMotionValue(-1);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight }),
    );
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // auto boot loader — runs even untouched; the puzzle forms at 100%
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const DUR = 3200;
    const tick = (t: number) => {
      if (doneRef.current) return;
      const p = Math.min(100, ((t - start) / DUR) * 100);
      setPct(p);
      if (p >= 100) doneRef.current = true;
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const signs = useMemo(() => genSigns(), []);
  const meta = useMemo(() => genMeta(), []);
  const pieces = useMemo(
    () => (size.w > 0 ? buildPieces(size.w, size.h, signs) : []),
    [size, signs],
  );

  const frac = pct / 100;
  const formed = pct >= 100;

  // once formed, let the pieces settle ~0.5s before arming the auto-advance
  useEffect(() => {
    if (!formed) return;
    const id = window.setTimeout(() => setSettled(true), 500);
    return () => clearTimeout(id);
  }, [formed]);

  // 3s after the B forms, auto-advance to the portfolio — UNLESS the visitor has
  // already scrolled/taken over. Smooth-scrolling drives scrollYProgress, which
  // drives the pieces' scatter-and-fall (same as scrolling manually).
  useEffect(() => {
    if (!settled) return;
    const id = window.setTimeout(() => {
      if (scrollYProgress.get() < 0.04) onEnter?.();
    }, 3000);
    return () => clearTimeout(id);
  }, [settled, onEnter, scrollYProgress]);

  const onPointerMove = (e: React.PointerEvent) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onPointerLeave = () => {
    mx.set(-1);
    my.set(-1);
  };

  const onClick = () => {
    if (!formed) {
      doneRef.current = true;
      setPct(100); // skip the loader
    }
  };

  return (
    <div
      ref={boxRef}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="pointer-events-auto relative cursor-pointer"
      style={{
        height: "min(46vh, 400px)",
        aspectRatio: `${698} / ${873}`,
      }}
      role="button"
      aria-label={formed ? "Brigit Thomas — scroll to enter the portfolio" : "Skip the loader"}
    >
      {/* Pieces layer — the resting visual IS the puzzle. Pieces stay mounted:
          they assemble, react to hover, then scatter + fall on scroll. */}
      <div className="pointer-events-none absolute inset-0">
        {pieces.map((g, i) => (
          <Piece
            key={i}
            src={bImg}
            geom={g}
            meta={meta[i]}
            assembled={frac >= meta[i].threshold}
            hoverable={settled}
            mx={mx}
            my={my}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Blue spray-paint trail — transparent canvas over the pieces */}
      {settled && <SprayOverlay mx={mx} my={my} />}

      {/* Boot loader — small % readout + bar, hidden once formed */}
      {!formed && (
        <div className="pointer-events-none absolute bottom-[6%] left-1/2 z-10 w-[42%] -translate-x-1/2 text-center">
          <div
            className="mb-1 font-mono text-[0.7rem] tracking-[0.3em] text-white/85"
            style={{ textShadow: "0 1px 6px rgba(33,31,29,0.6)" }}
          >
            LOADING {Math.round(pct)}%
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Intro({
  onEnter,
  scrollContainerRef,
}: {
  onEnter: () => void;
  scrollContainerRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    // h-screen target: 0 at top, 1 after scrolling one viewport down
    offset: ["start start", "end start"],
  });
  // spring-smoothed progress so the scatter/parallax glides — snappy enough to
  // track the scroll without visibly lagging behind it
  const smooth = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 42,
    mass: 0.25,
    restDelta: 0.001,
  });
  return (
    // single-screen intro; scrolling moves straight on to the portfolio (no gap)
    <div ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Textured backdrop the white card sits on (Podium frame) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, var(--brand-soft) 0%, var(--brand) 45%, var(--brand-deep) 100%)",
        }}
      />

      {/* White card — backdrop panel with social nav + scroll cue */}
      <div className="absolute inset-3 overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-40px_rgba(33,31,29,0.5)] sm:inset-5">
        <div className="relative flex h-full w-full flex-col px-6 py-5 sm:px-10 sm:py-7">
          {/* Top bar — social handles, right end only */}
          <div className="relative z-20 flex items-center justify-end">
            <nav className="flex items-center gap-5 sm:gap-6">
              {SOCIALS.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-foreground/70 transition hover:text-foreground"
                  whileHover={pixelHover}
                >
                  <Icon className="size-5" />
                </motion.a>
              ))}
            </nav>
          </div>

          <div className="flex-1" />

          {/* Bottom row — scroll-down cue */}
          <div className="relative z-20 flex items-end justify-end gap-6">
            <button
              type="button"
              onClick={onEnter}
              className="group flex shrink-0 items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground/70 transition hover:text-foreground"
            >
              Scroll down
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ArrowDown className="size-4" />
              </motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* Puzzle overlay — above the card so pieces can scatter across screen */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <PuzzleB scrollYProgress={smooth} onEnter={onEnter} />
      </div>
    </div>
  );
}
