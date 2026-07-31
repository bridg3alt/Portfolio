import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { FolderIcon } from "./folder-icon";

export type DockItem = {
  id: string;
  label: string;
  tint: string;
};

type DockProps = {
  items: DockItem[];
  onOpen: (id: string) => void;
  activeId?: string | null;
};

export function Dock({ items, onOpen, activeId }: DockProps) {
  const mouseX = useMotionValue<number>(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-end gap-3 rounded-2xl border border-white/40 px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        boxShadow:
          "0 30px 60px -20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {items.map((item) => (
        <DockIcon
          key={item.id}
          mouseX={mouseX}
          item={item}
          active={activeId === item.id}
          onOpen={onOpen}
        />
      ))}
    </motion.div>
  );
}

function DockIcon({
  mouseX,
  item,
  active,
  onOpen,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
  active: boolean;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });

  const sizeRaw = useTransform(distance, [-140, 0, 140], [52, 88, 52]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 200, damping: 14 });

  const liftRaw = useTransform(distance, [-140, 0, 140], [0, -14, 0]);
  const lift = useSpring(liftRaw, { mass: 0.1, stiffness: 200, damping: 14 });

  return (
    <div className="group relative flex flex-col items-center">
      <motion.div
        className="pointer-events-none absolute -top-10 rounded-md border border-white/30 px-2 py-1 text-white text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      >
        {item.label}
      </motion.div>

      <motion.button
        ref={ref}
        onClick={() => onOpen(item.id)}
        style={{ width: size, height: size, y: lift }}
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
        className="relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg"
        aria-label={item.label}
      >
        <FolderIcon
          tint={item.tint}
          className="size-full drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
        />
      </motion.button>

      <span
        className={`mt-1.5 size-1 rounded-full bg-white transition-opacity ${
          active ? "opacity-90" : "opacity-0"
        }`}
      />
    </div>
  );
}
