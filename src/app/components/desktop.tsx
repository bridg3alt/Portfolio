import { type ReactNode } from "react";
import { motion } from "motion/react";

type DesktopProps = {
  children: ReactNode;
  dock: ReactNode;
};

export function Desktop({ children, dock }: DesktopProps) {
  return (
    <section className="relative mx-auto my-12 max-w-7xl px-4 sm:px-12">
      <div
        className="relative overflow-hidden rounded-3xl border border-border"
        style={{
          minHeight: "82vh",
          boxShadow:
            "0 40px 80px -30px rgba(15, 15, 40, 0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {/* Sunset / ocean inspired backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #6dd5fa 0%, #b8b6e6 28%, #f5b6c8 52%, #ffb88c 72%, #2b3a8a 100%)",
          }}
        />
        {/* Sun glow */}
        <div
          className="absolute"
          style={{
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "380px",
            height: "380px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,200,160,0.35) 35%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        {/* Horizon line */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: "62%",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />
        {/* Subtle wave shimmer */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%] opacity-40 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(180deg, transparent 0 6px, rgba(255,255,255,0.08) 6px 7px)",
          }}
        />

        {/* macOS menu bar */}
        <div
          className="relative z-10 flex items-center justify-between px-4 py-1.5 text-white text-xs"
          style={{
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="size-3 rounded-sm bg-white/80" />
            <span style={{ fontWeight: 600 }}>Finder</span>
            <span className="opacity-80 hidden sm:inline">File</span>
            <span className="opacity-80 hidden sm:inline">Edit</span>
            <span className="opacity-80 hidden sm:inline">View</span>
            <span className="opacity-80 hidden sm:inline">Window</span>
            <span className="opacity-80 hidden sm:inline">Help</span>
          </div>
          <div className="flex items-center gap-3 opacity-90">
            <span className="font-portfolio">Brigit's Portfolio</span>
            <span>·</span>
            <span>Sat 23 May</span>
          </div>
        </div>

        {/* Section label */}
        <div className="relative z-10 px-6 pt-10 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className="text-white/85"
          >
            <div className="flex items-center gap-3">
              <span className="block h-[2px] w-8 bg-white/85" />
              <span className="text-xs tracking-[0.3em] uppercase">
                The Desktop
              </span>
            </div>
            <h2
              className="font-display mt-5 max-w-2xl text-white"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.6rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
              }}
            >
              Open a folder to explore my work.
            </h2>
          </motion.div>
        </div>

        {/* Children area for windows */}
        <div className="relative z-20">{children}</div>

        {/* Dock at bottom */}
        <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
          {dock}
        </div>
      </div>
    </section>
  );
}
