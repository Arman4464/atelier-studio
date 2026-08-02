import { testimonials } from "../../data/content";
import Rating from "../Rating";

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-[1800px] px-1.5 py-1.5">
      <div className="mb-8 flex flex-col gap-4 px-4 pt-10 sm:flex-row sm:items-end sm:justify-between md:px-6">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">From Our Customers</span>
          <h2 className="font-display text-4xl font-black uppercase text-ink md:text-6xl">Worn &amp; Trusted</h2>
        </div>
        <div className="flex items-center gap-3">
          <Rating value={5} />
          <span className="text-xs text-ink-dim">4.8 average across 1,204 reviews</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.author} className="flex flex-col justify-between border border-line bg-void-2 p-8">
            <div>
              <Rating value={t.rating} className="mb-4" />
              <p className="font-display text-xl leading-snug text-ink">&ldquo;{t.text}&rdquo;</p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
              <div>
                <span className="block text-sm font-semibold text-ink">{t.author}</span>
                <span className="text-[11px] text-ink-dim">{t.location}</span>
              </div>
              {t.verified && (
                <span className="border border-indigo-glow/30 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-indigo-glow">
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
