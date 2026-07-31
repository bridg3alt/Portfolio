import { motion } from "motion/react";
import { SectionShell } from "./section-shell";
import { EDUCATION_COLUMNS } from "../data/content";

export function Education() {
  return (
    <SectionShell
      kicker="Academic Journey"
      title="Education"
      titleSize="clamp(2.6rem, 7vw, 5.5rem)"
    >
      <div
        className="grid border-t md:grid-cols-3"
        style={{ borderColor: "color-mix(in srgb, var(--ink) 30%, transparent)" }}
      >
        {EDUCATION_COLUMNS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            // rules only between columns, and only once they sit side by side
            className={
              i === 0
                ? "py-8 md:pr-8"
                : "border-t py-8 md:border-t-0 md:border-l md:px-8"
            }
            style={{
              borderColor: "color-mix(in srgb, var(--ink) 18%, transparent)",
            }}
          >
            <div
              className="font-mono text-[0.7rem] uppercase tracking-[0.28em]"
              style={{ color: "var(--ink-soft)" }}
            >
              {c.period}
            </div>

            <h3
              className="font-display mt-5 text-xl font-semibold uppercase leading-snug"
              style={{ color: "var(--ink)" }}
            >
              {c.institution}
            </h3>

            <p className="mt-3 leading-relaxed text-muted-foreground">
              {c.detail}
            </p>

            <div
              className="mt-4 font-semibold"
              style={{ color: "var(--ink)" }}
            >
              {c.stat}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
