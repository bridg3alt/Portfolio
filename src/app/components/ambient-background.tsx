import { motion } from "motion/react";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Soft brand light — calmer, premium */}
      <div
        className="absolute top-[-22%] right-[-8%] h-[52vw] w-[52vw] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand-glow), transparent 70%)",
          filter: "blur(110px)",
        }}
      />
      <div
        className="absolute bottom-[-28%] left-[-16%] h-[58vw] w-[58vw] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, var(--brand-glow), transparent 70%)",
          filter: "blur(130px)",
        }}
      />

      {/* Single golden-ratio vertical guide (φ ≈ 61.8%) — very subtle */}
      <div
        className="absolute inset-y-0 w-px opacity-[0.06]"
        style={{ left: "61.8%", background: "var(--foreground)" }}
      />

      {/* A few slow, restrained particles */}
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            left: `${(i * 61.8) % 100}%`,
            top: `${(i * 38.2) % 100}%`,
            background: i % 2 === 0 ? "var(--brand)" : "var(--brand-soft)",
            opacity: 0.3,
            filter: "blur(0.5px)",
          }}
          animate={{ y: [0, -22, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{
            duration: 11 + (i % 4),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}
    </div>
  );
}
