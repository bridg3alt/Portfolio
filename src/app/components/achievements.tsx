import { motion } from "motion/react";
import { Award, Plane, Lightbulb, Users } from "lucide-react";
import { SectionShell } from "./section-shell";
import { ACHIEVEMENT_CARDS } from "../data/content";

// lucide rather than emoji — emoji were deliberately removed from Skills
const ICONS = {
  award: Award,
  travel: Plane,
  idea: Lightbulb,
  people: Users,
} as const;

export function Achievements() {
  return (
    <div style={{ background: "var(--ink)" }}>
      <SectionShell
        kicker="Awards"
        title="Recognitions &"
        accent="Achievements"
        tone="dark"
        titleSize="clamp(2.2rem, 5.5vw, 4.2rem)"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ACHIEVEMENT_CARDS.map((item, i) => {
            const Icon = ICONS[item.icon ?? "award"];
            return (
              <motion.a
                key={item.name}
                href={item.link}
                target={item.link.startsWith("http") ? "_blank" : undefined}
                rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                whileHover={{ y: -3 }}
                className="flex h-full flex-col border border-white/15 p-7 transition-colors hover:bg-white/5"
              >
                <Icon className="size-6 text-white/70" strokeWidth={1.6} />

                <h3 className="font-display mt-6 text-lg font-semibold uppercase leading-snug text-white">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.issuer}
                </p>

                {/* mt-auto keeps dates aligned across a row of uneven titles */}
                <div className="mt-auto pt-8 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-white/85">
                  {item.date}
                </div>
              </motion.a>
            );
          })}
        </div>
      </SectionShell>
    </div>
  );
}
