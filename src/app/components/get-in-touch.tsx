import { motion } from "motion/react";
import { pixelHover } from "./pixel-hover";
import { SectionShell } from "./section-shell";
import brigit from "../../styles/LINKEDIN-cut.png";

type Link = { label: string; href: string };

export function GetInTouch({ links }: { links: Link[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "var(--ink-deep)" }}
    >
      {/* Ghosted hero backdrop — the wordmark and portrait from screen one,
          barely visible. Static copy of the word rather than the Wordmark
          component, which self-measures and is not exported. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="font-portfolio select-none whitespace-nowrap text-white/[0.06]"
          style={{ fontSize: "clamp(6rem, 19vw, 18rem)", lineHeight: 0.78 }}
        >
          PORTFOLIO
        </span>
      </div>
      <img
        aria-hidden
        src={brigit}
        alt=""
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-auto max-w-none select-none object-contain opacity-[0.10]"
      />
      {/* scrim so the copy stays readable over both layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--ink-deep) 70%, transparent)" }}
      />

      <SectionShell
        id="contact"
        kicker="Let's Connect"
        title="Get In"
        accent="Touch"
        tone="dark"
        align="center"
        titleSize="clamp(2.6rem, 8vw, 6rem)"
        className="relative z-10 pb-12"
      >
        <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-white/65">
          Whether it's a collaboration, a speaking opportunity, a conversation
          about accessible technology, or just a good chat — reach out anytime.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {links.map(({ label, href }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={pixelHover}
              className="group inline-flex items-center gap-3 border border-white/25 px-8 py-4 transition-colors hover:bg-white/5"
            >
              <span className="font-mono text-sm uppercase tracking-[0.22em] text-white">
                {label}
              </span>
              <span className="text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/45 sm:flex-row">
          <span>© {new Date().getFullYear()} Brigit Thomas</span>
          <span>All rights reserved</span>
        </div>
      </SectionShell>
    </div>
  );
}
