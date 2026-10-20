import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ACHIEVEMENT_STATS } from "../data/content";
import { resolveAsset } from "../data/assets";

/** seconds for the auto-scroll to travel one full copy of the list */
const LOOP_SECONDS = 34;
/** how long auto-scroll waits after an arrow click or a swipe ends */
const RESUME_DELAY_MS = 1500;

/**
 * Auto-scrolling achievements rail — headline stat, title, one-line context,
 * over a photo. The list is rendered twice so the scroll can loop seamlessly
 * (jumping back by one copy's width is invisible); the duplicate is hidden
 * from assistive tech.
 *
 * The rail is a real horizontal scroller driven by requestAnimationFrame, not a
 * CSS transform, so the arrows, touch swipes and trackpad scrolling all move
 * the same position the auto-scroll does. Auto-scroll pauses on mouse hover,
 * while a finger/pointer is down, and briefly after an arrow click; it is off
 * entirely under prefers-reduced-motion.
 */
export function AchievementRail() {
  const loop = [...ACHIEVEMENT_STATS, ...ACHIEVEMENT_STATS];
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const pausedUntil = useRef(0);
  // float position — scrollLeft rounds, which would stall slow scrolling
  const pos = useRef<number | null>(null);

  // width of one copy of the list (start of the duplicate minus start of the original)
  const copyWidth = () => {
    const kids = trackRef.current?.children;
    if (!kids || kids.length <= ACHIEVEMENT_STATS.length) return 0;
    const first = kids[0] as HTMLElement;
    const dup = kids[ACHIEVEMENT_STATS.length] as HTMLElement;
    return dup.offsetLeft - first.offsetLeft;
  };

  const isPaused = () =>
    hovering.current || performance.now() < pausedUntil.current;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1); // cap after tab switches
      last = now;
      const el = scrollerRef.current;
      const width = copyWidth();
      if (el && width > 0) {
        if (isPaused()) {
          pos.current = null; // re-read scrollLeft on resume
        } else {
          if (pos.current == null) pos.current = el.scrollLeft;
          pos.current += (width / LOOP_SECONDS) * dt;
          if (pos.current >= width) pos.current -= width;
          el.scrollLeft = pos.current;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // manual scrolling past the end of the first copy wraps back silently
  const onScroll = () => {
    const el = scrollerRef.current;
    const width = copyWidth();
    if (!el || width === 0) return;
    // only while the visitor is scrolling by hand — during an arrow's smooth
    // scroll, setting scrollLeft would cancel it, and auto-scroll wraps itself
    const manual = hovering.current || pausedUntil.current === Infinity;
    if (manual && el.scrollLeft >= width) el.scrollLeft -= width;
  };

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const kids = trackRef.current?.children;
    if (!el || !kids || kids.length < 2) return;
    const step =
      (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft;
    const width = copyWidth();
    // pre-wrap so there is always room to move in the chosen direction
    if (dir > 0 && el.scrollLeft + step >= width) el.scrollLeft -= width;
    if (dir < 0 && el.scrollLeft - step < 0) el.scrollLeft += width;
    pausedUntil.current = performance.now() + RESUME_DELAY_MS;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_10px_24px_-8px_rgba(0,0,0,0.55)] transition hover:scale-105 hover:brightness-125 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full border-y py-10 md:py-12"
      style={{
        borderColor: "color-mix(in srgb, var(--ink) 14%, transparent)",
      }}
    >
      <div className="mb-8 flex items-center gap-4 px-6 sm:px-12 lg:px-20">
        <span
          className="font-mono text-[0.7rem] uppercase tracking-[0.3em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Achievements
        </span>
        <span
          className="h-px flex-1"
          style={{ background: "color-mix(in srgb, var(--ink) 18%, transparent)" }}
        />
      </div>

      <div className="relative">
        {([-1, 1] as const).map((dir) => {
          const Icon = dir < 0 ? ChevronLeft : ChevronRight;
          return (
            <button
              key={dir}
              type="button"
              onClick={() => nudge(dir)}
              aria-label={dir < 0 ? "Previous achievement" : "Next achievement"}
              className={`${arrow} ${dir < 0 ? "left-2 sm:left-4" : "right-2 sm:right-4"}`}
              style={{ background: "var(--ink)", color: "#FFFFFF" }}
            >
              <Icon className="size-6" strokeWidth={2.2} />
            </button>
          );
        })}

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") hovering.current = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") hovering.current = false;
          }}
          // touch events, not pointer events: the browser fires pointercancel as
          // soon as a swipe turns into native panning, which would resume early
          onTouchStart={() => {
            pausedUntil.current = Infinity;
          }}
          onTouchEnd={() => {
            pausedUntil.current = performance.now() + RESUME_DELAY_MS;
          }}
          onTouchCancel={() => {
            pausedUntil.current = performance.now() + RESUME_DELAY_MS;
          }}
          className="achieve-scroller overflow-x-auto pl-6 sm:pl-12 lg:pl-20"
        >
          <div ref={trackRef} className="flex w-max gap-10">
            {loop.map((item, i) => {
              const src = resolveAsset(item.image);
              const duplicate = i >= ACHIEVEMENT_STATS.length;

              return (
                <article
                  key={`${item.title}-${i}`}
                  aria-hidden={duplicate}
                  className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border md:w-[420px]"
                  style={{
                    borderColor: "color-mix(in srgb, var(--ink) 14%, transparent)",
                    background: "var(--background)",
                  }}
                >
                  {/* the photo itself — landscape frame, no tint, nothing over it */}
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden"
                    style={{ background: "color-mix(in srgb, var(--ink) 6%, transparent)" }}
                  >
                    {src && (
                      <img
                        src={src}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    )}
                  </div>

                  {/* small label under the photo */}
                  <div className="px-4 py-3">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="font-mono text-[0.62rem] uppercase tracking-[0.18em]"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {item.value}
                      </span>
                      <span
                        className="text-sm font-semibold leading-snug"
                        style={{ color: "var(--ink)" }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
