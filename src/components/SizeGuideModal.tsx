import { AnimatePresence, motion } from "motion/react";
import { useUIStore } from "../store/uiStore";

const rows = [
  { size: "XS", chest: "84–88", waist: "66–70", eu: "44" },
  { size: "S", chest: "89–93", waist: "71–75", eu: "46" },
  { size: "M", chest: "94–98", waist: "76–81", eu: "48" },
  { size: "L", chest: "99–104", waist: "82–88", eu: "50" },
];

export default function SizeGuideModal() {
  const open = useUIStore((s) => s.sizeGuideOpen);
  const setOpen = useUIStore((s) => s.setSizeGuideOpen);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="glass relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <h3 className="font-display text-2xl font-bold text-ink">Sizing Chart</h3>
              <button onClick={() => setOpen(false)} className="text-xs uppercase tracking-widest text-ink-dim hover:text-ink">Close</button>
            </div>
            <table className="w-full text-xs text-ink">
              <thead>
                <tr className="border-b border-line text-left uppercase tracking-widest text-ink-dim">
                  <th className="py-2 font-medium">Size</th>
                  <th className="py-2 font-medium">Chest (cm)</th>
                  <th className="py-2 font-medium">Waist (cm)</th>
                  <th className="py-2 font-medium">EU</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {rows.map((r) => (
                  <tr key={r.size} className="border-b border-line/60">
                    <td className="py-2.5">{r.size}</td>
                    <td>{r.chest}</td>
                    <td>{r.waist}</td>
                    <td>{r.eu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 text-xs leading-relaxed text-ink-dim">
              Every piece is cut true to these measurements — we don't vanity-size. Between sizes? Size up for outerwear, size down for knitwear.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
