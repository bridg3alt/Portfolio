import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.5 });

  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <div
        className="size-[720px] rounded-full opacity-95 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--brand) 60%, transparent), transparent 72%)",
        }}
      />
    </motion.div>
  );
}
