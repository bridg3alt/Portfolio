import { Fragment, useMemo } from "react";
import { motion } from "motion/react";

/**
 * Podium-style character reveal: text assembles letter-by-letter in a random
 * order (like GSAP SplitText with `from: 'random'`), built with Framer stagger.
 * Words stay intact for wrapping; only characters animate.
 */
export function SplitText({
  text,
  className,
  gradient,
  duration = 0.5,
  stagger = 0.7,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** optional CSS background-image; applied per char as a clipped text gradient */
  gradient?: string;
  duration?: number;
  /** total spread of the randomized per-char delays (seconds) */
  stagger?: number;
  delay?: number;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const total = useMemo(
    () => words.reduce((n, w) => n + w.length, 0),
    [words],
  );

  // randomized per-char delay: shuffle char indices, map rank -> delay
  const delays = useMemo(() => {
    const order = Array.from({ length: total }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const rank = new Array<number>(total);
    order.forEach((idx, k) => (rank[idx] = k));
    const denom = Math.max(total - 1, 1);
    return rank.map((r) => delay + (r / denom) * stagger);
  }, [total, stagger, delay]);

  const gradientStyle = gradient
    ? {
        backgroundImage: gradient,
        WebkitBackgroundClip: "text" as const,
        backgroundClip: "text" as const,
        color: "transparent",
      }
    : undefined;

  let ci = 0;
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span style={{ display: "inline-block" }}>
            {Array.from(word).map((ch) => {
              const d = delays[ci++];
              return (
                <motion.span
                  key={ci}
                  aria-hidden
                  style={{ display: "inline-block", ...gradientStyle }}
                  variants={{
                    hidden: { opacity: 0, y: "0.35em" },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration, delay: d, ease: "easeOut" },
                    },
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
