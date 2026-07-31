import { type ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Shared frame for every scrolling page section: a small kicker, a large
 * display title whose trailing word drops to a lighter shade, then the body.
 *
 * `tone="dark"` only recolours the type — the caller supplies the background,
 * so a section can layer its own artwork behind this.
 */
export function SectionShell({
  id,
  kicker,
  title,
  accent,
  tone = "light",
  align = "left",
  titleSize = "clamp(2rem, 4vw, 3rem)",
  children,
  className = "",
}: {
  id?: string;
  kicker: string;
  /** leading words, rendered in the strong colour */
  title: string;
  /** trailing word, rendered in the softer colour */
  accent?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  titleSize?: string;
  children: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";
  const strong = dark ? "#FEFEFE" : "var(--ink)";
  const soft = dark ? "rgba(255,255,255,0.55)" : "var(--ink-soft)";
  const rule = dark ? "rgba(255,255,255,0.45)" : "rgb(0 0 0 / 0.4)";
  const centered = align === "center";

  return (
    <section
      id={id}
      className={`relative w-full px-6 py-24 sm:px-12 lg:px-20 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`mb-12 ${centered ? "flex flex-col items-center text-center" : ""}`}
      >
        <div className="flex items-center gap-[13px]">
          <span
            className="block h-px w-9"
            style={{ background: rule }}
          />
          <span
            className="font-mono text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: soft }}
          >
            {kicker}
          </span>
        </div>
        <h2
          className="font-display mt-4"
          style={{
            fontSize: titleSize,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: strong,
          }}
        >
          {title}
          {accent && (
            <>
              {centered ? <br /> : " "}
              <span style={{ color: soft }}>{accent}</span>
            </>
          )}
        </h2>
      </motion.div>

      {children}
    </section>
  );
}
