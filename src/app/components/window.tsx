import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

type WindowProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  /** shared-layout id matching the dock tile, for the Flip-style expand */
  layoutId?: string;
};

export function MacWindow({
  open,
  title,
  subtitle,
  onClose,
  children,
  layoutId,
}: WindowProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop — dim + blur, faint ink tint */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(33,31,29,0.42)", backdropFilter: "blur(14px)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Editorial panel — ink glass frame, white body */}
          <motion.div
            layout={layoutId ? true : undefined}
            layoutId={layoutId}
            initial={layoutId ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 28 }}
            animate={layoutId ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={layoutId ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-[1.75rem]"
            style={{
              background: "#ffffff",
              border: "1px solid color-mix(in srgb, var(--brand) 22%, transparent)",
              boxShadow:
                "0 50px 90px -40px color-mix(in srgb, var(--brand-deep) 55%, transparent), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            {/* Floating close — replaces the macOS traffic lights */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid color-mix(in srgb, var(--brand) 35%, transparent)",
                color: "var(--ink)",
                backdropFilter: "blur(8px)",
              }}
            >
              <X className="size-4" strokeWidth={2} />
            </button>

            {/* Header block — kicker · display title · ink underline */}
            <div
              className="relative px-7 pt-9 pb-6 sm:px-10 sm:pt-11"
              style={{
                background:
                  "radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--brand-soft) 55%, transparent) 0%, transparent 55%)",
              }}
            >
              {subtitle && (
                <div
                  className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "var(--ink)" }}
                >
                  {subtitle}
                </div>
              )}
              <h2
                className="font-display pr-12 text-foreground"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h2>
              <div
                className="mt-4 h-[3px] w-12 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--ink-deep), var(--ink-soft))",
                }}
              />
            </div>

            {/* Body */}
            <div
              className="relative max-h-[78vh] overflow-y-auto px-7 pb-9 pt-1 sm:px-10"
              style={{ color: "var(--foreground)" }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
