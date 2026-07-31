import { motion } from "motion/react";
import { SectionShell } from "./section-shell";
import { LEADERSHIP, INTERNSHIPS, type TimelineEntry } from "../data/content";

/**
 * Vertical timeline — gradient rail with dots on the left, entries staggered in
 * as they enter the viewport. Positions only: period, title, organisation. The
 * detailed write-ups live in the folder windows.
 */
function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-ink/40 to-transparent"
      />

      <div className="flex flex-col gap-8">
        {entries.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="relative pl-8"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1.5 size-[19px] rounded-full border-4 border-background"
              style={{
                background: "var(--ink)",
                boxShadow: "0 0 0 1px color-mix(in srgb, var(--ink) 30%, transparent)",
              }}
            />
            <div
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em]"
              style={{ color: "var(--ink-soft)" }}
            >
              {e.period}
            </div>
            <h4
              className="mt-2 text-xl font-semibold leading-snug"
              style={{ color: "var(--ink)" }}
            >
              {e.title}
            </h4>
            <div className="mt-1 font-medium text-muted-foreground">{e.org}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <h3
      className="mb-8 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.28em]"
      style={{ color: "var(--ink)" }}
    >
      {children}
    </h3>
  );
}

export function Journey() {
  return (
    <SectionShell kicker="The Journey" title="Leadership &" accent="Experience">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <GroupLabel>Leadership &amp; Volunteering</GroupLabel>
          <Timeline entries={LEADERSHIP} />
        </div>
        <div>
          <GroupLabel>Internships</GroupLabel>
          <Timeline entries={INTERNSHIPS} />
        </div>
      </div>
    </SectionShell>
  );
}
