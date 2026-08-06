import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionShell } from "./section-shell";
import { UPDATES, type UpdateEntry } from "../data/content";
import { resolveAsset } from "../data/assets";

const AUTOPLAY_MS = 5000;

/** Transform table keyed by distance from the active card. */
function cardStyle(relative: number) {
  const abs = Math.abs(relative);
  const sign = Math.sign(relative);

  if (abs === 0) {
    return {
      transform: "translateX(0px) scale(1) rotateY(0deg)",
      opacity: 1,
      zIndex: 10,
      filter: "brightness(1)",
    };
  }
  if (abs === 1) {
    return {
      transform: `translateX(${sign * 180}px) scale(0.9) rotateY(${-sign * 10}deg)`,
      opacity: 0.6,
      zIndex: 5,
      filter: "brightness(0.8)",
    };
  }
  if (abs === 2) {
    return {
      transform: `translateX(${sign * 360}px) scale(0.85) rotateY(${-sign * 20}deg)`,
      opacity: 0.4,
      zIndex: 2,
      filter: "brightness(0.65)",
    };
  }
  return {
    transform: `translateX(${sign * 460}px) scale(0.75) rotateY(${-sign * 28}deg)`,
    opacity: 0,
    zIndex: 0,
    filter: "brightness(0.5)",
  };
}

function Card({
  item,
  active,
  onClick,
  style,
}: {
  item: UpdateEntry;
  active: boolean;
  onClick: () => void;
  style: ReturnType<typeof cardStyle>;
}) {
  const src = resolveAsset(item.image);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={item.title}
      aria-current={active}
      className="absolute h-[460px] w-80 overflow-hidden rounded-2xl border text-left transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        ...style,
        borderColor: "color-mix(in srgb, var(--ink) 18%, transparent)",
        boxShadow: "0 30px 60px -35px rgba(33,31,29,0.55)",
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // no photo supplied yet — typographic panel instead of a broken image
        <div
          className="absolute inset-0 flex items-end p-6"
          style={{
            background:
              "linear-gradient(160deg, var(--ink-deep), var(--ink) 60%, var(--ink-soft))",
          }}
        >
          <span
            className="font-display leading-none text-white/15"
            style={{ fontSize: "3.4rem" }}
          >
            {item.category}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/30 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/85">
            {item.category}
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/60">
            {item.date}
          </span>
        </div>

        <h4 className="font-display mt-3 text-xl leading-snug text-white">
          {item.title}
        </h4>

        {/* excerpt only on the focused card, as in the reference */}
        {active && (
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {item.excerpt}
          </p>
        )}
      </div>
    </button>
  );
}

export function Profile() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = UPDATES.length;

  const go = useCallback(
    (delta: number) => setActive((i) => (i + delta + count) % count),
    [count],
  );

  // autoplay: paused on hover/focus, skipped entirely under reduced motion
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  return (
    <SectionShell kicker="Behind the Work" title="The" accent="Profile">
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="relative flex h-[500px] items-center justify-center overflow-hidden"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {UPDATES.map((item, i) => {
            // shortest circular distance, so the rail wraps both ways
            let relative = i - active;
            if (relative > count / 2) relative -= count;
            if (relative < -count / 2) relative += count;

            return (
              <Card
                key={item.id}
                item={item}
                active={relative === 0}
                onClick={() => setActive(i)}
                style={cardStyle(relative)}
              />
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="flex size-10 items-center justify-center rounded-full border transition hover:brightness-95"
            style={{
              borderColor: "color-mix(in srgb, var(--ink) 20%, transparent)",
              color: "var(--ink)",
            }}
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            {UPDATES.map((u, i) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to ${u.title}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? "1.6rem" : "0.4rem",
                  background:
                    i === active
                      ? "var(--ink)"
                      : "color-mix(in srgb, var(--ink) 25%, transparent)",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="flex size-10 items-center justify-center rounded-full border transition hover:brightness-95"
            style={{
              borderColor: "color-mix(in srgb, var(--ink) 20%, transparent)",
              color: "var(--ink)",
            }}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </SectionShell>
  );
}
