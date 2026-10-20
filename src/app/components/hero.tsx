import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { FolderIcon } from "./folder-icon";
import { SplitText } from "./split-text";
import { SKILL_CHIPS } from "../data/content";

type HeroFile = { id: string; label: string; tint: string; paper?: string };

function FileTile({
  item,
  index,
  mouseX,
}: {
  item: HeroFile;
  index: number;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 9999;
    return val - (rect.left + rect.width / 2);
  });

  const sizeTransform = useTransform(distance, [-160, 0, 160], [48, 74, 48]);
  const liftTransform = useTransform(distance, [-160, 0, 160], [0, -10, 0]);

  const size = useSpring(sizeTransform, { stiffness: 220, damping: 18 });
  const lift = useSpring(liftTransform, { stiffness: 220, damping: 18 });

  return (
    <motion.button
      ref={ref}
      onClick={() => undefined}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1 + index * 0.04 }}
      whileTap={{ scale: 0.92 }}
      className="relative flex flex-col items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
      data-id={item.id}
    >
      {/* invisible shared-layout source: the window Flip-expands from here */}
      <motion.div
        layoutId={`tile-${item.id}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{ background: item.tint, opacity: 0 }}
      />
      <motion.div
        style={{ width: size, height: size, y: lift }}
        className="flex items-center justify-center drop-shadow-[0_12px_18px_rgba(33,31,29,0.22)]"
      >
        <FolderIcon tint={item.tint} paper={item.paper} className="size-full" />
      </motion.div>
      <span
        className="text-[11px] tracking-wide text-center leading-tight"
        style={{
          color: "var(--ink)",
          // the dock is transparent now, so labels can land on her dark hair
          textShadow: "0 1px 3px rgba(255,255,255,0.85)",
        }}
      >
        {item.label}
      </span>
    </motion.button>
  );
}

// The word must span the column exactly. A hardcoded `vw` font-size can only
// approximate that and overshooting throws letters off both edges, so measure
// the rendered word once at a probe size and scale from the real ratio.
const WORDMARK_LINE_HEIGHT = 0.78;

function Wordmark({ maxHeightPx }: { maxHeightPx?: number }) {
  const letters = Array.from("PORTFOLIO");
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLHeadingElement>(null);
  const [fontSize, setFontSize] = useState(0);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const row = rowRef.current;
    if (!wrap || !row) return;

    const PROBE = 200;
    const fit = () => {
      const avail = wrap.clientWidth;
      if (!avail) return;
      const prevSize = row.style.fontSize;
      const prevWidth = row.style.width;
      // `justify-between` stretches the row to the container, so the natural
      // width is only observable with the flex box sized to its content.
      row.style.fontSize = `${PROBE}px`;
      row.style.width = "max-content";
      const natural = row.scrollWidth;
      row.style.fontSize = prevSize;
      row.style.width = prevWidth;
      if (!natural) return;

      // 0.985: scrollWidth rounds down sub-pixels, and the letter-spacing on
      // .font-portfolio adds a trailing advance the probe does not report, so an
      // exact fit still spills the last letter past the right edge.
      const byWidth = (PROBE * avail * 0.985) / natural;
      // Width alone made the word absurdly tall on short viewports, pushing the
      // copy above it off the band. Cap against the height budget too.
      const byHeight = maxHeightPx
        ? maxHeightPx / WORDMARK_LINE_HEIGHT
        : Infinity;
      setFontSize(Math.min(byWidth, byHeight));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    // Webfont swap changes the metrics, so re-fit once Montserrat lands.
    document.fonts?.ready.then(fit).catch(() => undefined);
    return () => ro.disconnect();
  }, [maxHeightPx]);

  return (
    <div ref={wrapRef} className="relative z-20 w-full">
      <h1
        ref={rowRef}
        className="font-portfolio flex select-none justify-between whitespace-nowrap"
        aria-label="Portfolio"
        style={{
          fontSize: fontSize ? `${fontSize}px` : undefined,
          lineHeight: WORDMARK_LINE_HEIGHT,
          color: "var(--ink)",
          // hidden until measured, so the probe size never flashes on screen
          visibility: fontSize ? "visible" : "hidden",
        }}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block origin-bottom cursor-default"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.12, color: "var(--ink-deep)" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: i * 0.04,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}

export function Hero({
  files,
  onOpen,
}: {
  files?: HeroFile[];
  onOpen?: (id: string) => void;
} = {}) {
  const mouseX = useMotionValue(-9999);

  // The wordmark gets a share of the hero height rather than sizing purely off
  // width, otherwise on a short viewport it grows tall enough to push the copy
  // block out of its band.
  const sectionRef = useRef<HTMLElement>(null);
  const [wordmarkCap, setWordmarkCap] = useState<number | undefined>();

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => setWordmarkCap(el.clientHeight * 0.3);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      // Mobile: content-height, gap-spaced, so a tall narrow viewport does not
      // stretch the three bands apart into big empty gaps. md+: the original
      // full-height layout where band A absorbs the slack.
      className="relative flex min-h-full flex-col justify-center gap-7 overflow-hidden px-6 py-6 sm:px-12 md:h-full md:justify-start md:gap-0 md:pt-2 md:pb-4"
    >
      {/* Band A — intro copy, set straight on the page (no panel).
          The portrait lives in App.tsx, one level up, so it can start at the
          very top of the screen instead of below the header.
          The copy is IN FLOW (not absolutely centred) so its height feeds the
          flex layout — otherwise it silently overflows onto the wordmark. */}
      <div className="relative flex min-h-0 min-w-0 items-center md:flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          // wide enough for the six chips to sit on one line, but never past viewport
          className="relative z-20 min-w-0 w-full max-w-[41rem]"
        >
          <div className="flex items-center gap-[13px]">
            <span className="block h-px w-9 bg-foreground/60" />
            <SplitText
              text="Who I Am"
              className="font-mono text-foreground/70 text-[0.7rem] tracking-[0.3em] uppercase"
              stagger={0.5}
            />
          </div>

          <h2
            className="font-display mt-[13px] text-foreground"
            style={{
              fontSize: "clamp(2rem, 3.6vw, 2.9rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.03em",
            }}
          >
            <SplitText text="Hello," duration={0.5} stagger={0.6} />
            <br />
            {/* nowrap from sm up only — smallest phones may need the break */}
            <span className="sm:whitespace-nowrap">
              <SplitText text="I'm" duration={0.5} stagger={0.6} delay={0.1} />{" "}
              <SplitText
                text="Brigit Thomas"
                className="italic"
                style={{ fontFamily: "'Playfair Display', var(--font-serif)" }}
                gradient="linear-gradient(120deg, var(--ink-deep), var(--ink-soft))"
                duration={0.5}
                stagger={0.6}
                delay={0.15}
              />
            </span>
          </h2>

          <p
            className="mt-4 max-w-[38rem] text-muted-foreground text-justify"
            style={{ fontSize: "0.95rem", lineHeight: 1.5, textAlignLast: "left" }}
          >
            I'm a <b className="text-foreground">Computer Science undergraduate</b>{" "}
            passionate about building technology that creates meaningful impact.
            My interests span <b className="text-foreground">Artificial Intelligence</b>,{" "}
            <b className="text-foreground">Data Science</b>,{" "}
            <b className="text-foreground">Assistive Technology</b>,{" "}
            <b className="text-foreground">Human-Centered Computing</b> and{" "}
            <b className="text-foreground">Robotics</b>, where I enjoy transforming
            ideas into practical solutions that put people first. Beyond
            engineering, I actively lead technical communities, collaborate with
            diverse teams, and embrace every opportunity to learn, innovate, and
            contribute.
          </p>

          {/* wraps on narrow screens; nowrap + shrink-0 keeps one line from sm up */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:flex-nowrap">
            {SKILL_CHIPS.map((chip) => (
              <span
                key={chip}
                className="shrink-0 whitespace-nowrap rounded-md border px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]"
                style={{
                  borderColor: "color-mix(in srgb, var(--ink) 20%, transparent)",
                  color: "var(--ink-soft)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Band B — wordmark, spanning the column and overlapping the portrait.
          md:mt-6 keeps a breathing gap between the chips and the wordmark;
          below md the section's own `gap` already provides it. */}
      <div className="relative z-20 shrink-0 md:mt-6">
        <Wordmark maxHeightPx={wordmarkCap} />
      </div>

      {/* Band C — premium glass folder dock */}
      {files && files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="relative z-30 shrink-0"
        >
          <motion.div
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(-9999)}
            className="rounded-[1.5rem] border px-3 py-4 sm:px-10"
            style={{
              // Transparent, unblurred: the portrait behind the dock stays
              // fully legible. Any backdrop-blur here would haze her out.
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
              borderColor: "color-mix(in srgb, var(--ink) 14%, transparent)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            <div className="flex flex-wrap items-end justify-center gap-x-1 gap-y-4 sm:justify-around sm:gap-x-2">
              {files.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => onOpen?.(item.id)}
                  className="cursor-pointer"
                >
                  <FileTile item={item} index={i} mouseX={mouseX} />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
