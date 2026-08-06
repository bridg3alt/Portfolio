import { motion } from "motion/react";
import { ACHIEVEMENT_STATS } from "../data/content";
import { resolveAsset } from "../data/assets";

/**
 * Auto-scrolling achievements rail — headline stat, title, one-line context,
 * over a dimmed photo. The list is rendered twice so the CSS translate can loop
 * seamlessly; the duplicate is hidden from assistive tech. Animation, hover
 * pause and the reduced-motion opt-out live in styles/globals.css
 * (`.achieve-track`) — the -50% keyframe assumes exactly one duplication.
 */
export function AchievementRail() {
  const loop = [...ACHIEVEMENT_STATS, ...ACHIEVEMENT_STATS];

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

      <div className="overflow-hidden pl-6 sm:pl-12 lg:pl-20">
        <div className="achieve-track flex w-max gap-10">
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
    </motion.div>
  );
}
