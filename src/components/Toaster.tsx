import { AnimatePresence, motion } from "motion/react";
import { useUIStore } from "../store/uiStore";

export default function Toaster() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass pointer-events-auto flex max-w-xs items-center gap-3 px-5 py-4 text-xs tracking-wide text-ink shadow-2xl"
          >
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-glow" />
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
