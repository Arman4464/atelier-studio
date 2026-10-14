import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useUIStore } from '../store/uiStore';

const rows = [
  { size: 'XS', chest: '84–88 CM', waist: '66–70 CM', eu: 'EU 44', drop: '74 CM' },
  { size: 'S', chest: '89–93 CM', waist: '71–75 CM', eu: 'EU 46', drop: '76 CM' },
  { size: 'M', chest: '94–98 CM', waist: '76–81 CM', eu: 'EU 48', drop: '78 CM' },
  { size: 'L', chest: '99–104 CM', waist: '82–88 CM', eu: 'EU 50', drop: '80 CM' },
  { size: 'XL', chest: '105–110 CM', waist: '89–95 CM', eu: 'EU 52', drop: '82 CM' },
];

export const SizeGuideModal: React.FC = () => {
  const open = useUIStore((s) => s.sizeGuideOpen);
  const setOpen = useUIStore((s) => s.setSizeGuideOpen);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-xl bg-[var(--bg-canvas)] text-[var(--ink-primary)] hairline-box shadow-2xl p-6 sm:p-8 font-ledger text-xs"
          >
            {/* Header */}
            <div className="pb-4 perforated-b flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[var(--accent-stamp)] uppercase tracking-widest block">
                  // MILAN WORKSHOP PATTERN TABLE
                </span>
                <h3 className="font-grotesk font-extrabold text-2xl uppercase mt-1">
                  Pattern Proportions
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-2.5 py-1 hairline-box uppercase hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
              >
                [ ESC ]
              </button>
            </div>

            {/* Spec Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="hairline-b text-[10px] uppercase text-[var(--ink-muted)]">
                    <th className="py-2.5">PATTERN (SIZE)</th>
                    <th className="py-2.5">CHEST</th>
                    <th className="py-2.5">WAIST</th>
                    <th className="py-2.5">EUROPE</th>
                    <th className="py-2.5 text-right">BACK DROP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-hairline)] text-xs">
                  {rows.map((r) => (
                    <tr key={r.size} className="hover:bg-[var(--bg-sub)] transition-colors">
                      <td className="py-3 font-bold text-[var(--accent-stamp)]">[{r.size}]</td>
                      <td className="py-3">{r.chest}</td>
                      <td className="py-3">{r.waist}</td>
                      <td className="py-3">{r.eu}</td>
                      <td className="py-3 text-right">{r.drop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctrine Note */}
            <div className="mt-6 pt-4 hairline-t space-y-2 text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              <p>
                Every garment is drafted with architectural drape allowances. We reject synthetic vanity sizing.
              </p>
              <p>
                BETWEEN SIZES: Recommend sizing up for unlined outerwear (Plate I/II), true to scale for trousers and shirting.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideModal;
