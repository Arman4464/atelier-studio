import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getFaqs } from "../../data/content";
import { useSettingsStore } from "../../store/settingsStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);
  const currency = useCartStore((s) => s.currency);
  const faqs = useMemo(
    () => getFaqs(formatPrice(freeShippingThreshold, currency)),
    [freeShippingThreshold, currency]
  );

  return (
    <section className="mx-auto max-w-4xl px-1.5 py-16">
      <span className="mb-2 block text-center text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Good to Know</span>
      <h2 className="mb-12 text-center font-display text-4xl font-black uppercase text-ink md:text-6xl">Frequent Questions</h2>
      <div className="border-t border-line">
        {faqs.map((faq, i) => (
          <div key={faq.q} className="border-b border-line">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-lg font-semibold text-ink md:text-xl">{faq.q}</span>
              <span className="flex-shrink-0 font-mono text-xl text-indigo-glow">{openIndex === i ? "\u2212" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink-dim">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
