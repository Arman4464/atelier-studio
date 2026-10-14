import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getFaqs } from "../../data/content";
import { useSettingsStore } from "../../store/settingsStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);
  const currency = useCartStore((s) => s.currency);
  const faqs = useMemo(
    () => getFaqs(formatPrice(freeShippingThreshold, currency)),
    [freeShippingThreshold, currency]
  );

  return (
    <section className="py-20 px-5 sm:px-10 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
          Client Inquiries
        </span>
        <h2 className="font-editorial italic text-4xl sm:text-6xl font-normal leading-tight">
          Frequently Considered
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.q}
              className="glass-card overflow-hidden transition-colors border border-[var(--glass-border-subtle)]"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 p-6 sm:p-7 text-left"
              >
                <span className="font-editorial italic text-2xl sm:text-3xl text-[var(--ink-primary)]">
                  {faq.q}
                </span>
                <span className="w-8 h-8 rounded-full bg-[var(--bg-sub)] flex items-center justify-center text-sm font-semibold shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 sm:px-7 pb-6 text-sm text-[var(--ink-secondary)] font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
