import React, { useState } from 'react';

const MONOGRAPHS = [
  {
    issue: 'MONOGRAPH N° 01',
    date: 'OCT 2026',
    readTime: '04 MIN DOSSIER',
    title: 'On Loomstate Selvedge & The Beauty of Irregular Tension',
    excerpt:
      'Why vintage shuttle looms in Okayama produce microscopic slub variations that modern air-jet looms erased from industrial fashion.',
    body: 'Modern textile engineering prizes speed and uniformity above all else. High-speed projectile looms fire weft yarns across warps at thousands of meters per minute, stripping the cloth of character. In our Autumn—Winter archive, we returned to 1950s Toyoda shuttle looms where wooden bobbins travel back and forth under low tension, preserving the organic density of raw cotton.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    issue: 'MONOGRAPH N° 02',
    date: 'SEP 2026',
    readTime: '06 MIN DOSSIER',
    title: 'Cold-Vat Iron Oxide & Botanical Dye Immersion',
    excerpt:
      'Documenting our 4-hour pigment immersion baths in Biella using fermented walnut husks, iron mordants, and rainwater.',
    body: 'Synthetic reactive dyes lock flat color onto the surface of a garment. Mineral and botanical immersion works differently: the pigment bonds unevenly with the natural oils of virgin wool and heavy duck canvas, creating living surfaces that lighten along high-friction seams.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
  },
  {
    issue: 'MONOGRAPH N° 03',
    date: 'AUG 2026',
    readTime: '05 MIN DOSSIER',
    title: 'Pattern Cutting as Structural Cantilever',
    excerpt:
      'Adapting 1940s French railway workwear gussets and bias-cut raglan sleeves for unrestricted kinetic movement.',
    body: 'When a coat relies on shoulder pads for structure, it fights the wearer. By rotating the sleeve pitch forward 12 degrees and inserting a single-piece underarm gusset, heavy 540 GSM wool hangs from the collarbone like a suspension bridge.',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
  },
];

export const Journal: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState(MONOGRAPHS[0]);

  return (
    <main className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Header */}
      <section className="px-6 sm:px-10 py-12 hairline-b grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-8">
          <span className="font-ledger text-xs uppercase tracking-widest text-[var(--accent-stamp)]">
            // DEPT. OF TEXTILE RESEARCH
          </span>
          <h1 className="font-grotesk font-extrabold text-4xl sm:text-6xl uppercase tracking-[-0.04em] mt-2">
            Atelier <span className="font-editorial italic font-normal lowercase">Monographs</span>
          </h1>
        </div>
        <div className="lg:col-span-4 font-ledger text-xs text-[var(--ink-secondary)] lg:text-right">
          PUBLISHED QUARTERLY IN MILAN & KYOTO
        </div>
      </section>

      {/* Editorial Broadsheet Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left 5 Columns: Issue Index */}
        <div className="lg:col-span-5 hairline-r">
          {MONOGRAPHS.map((item) => {
            const selected = activeArticle.issue === item.issue;
            return (
              <button
                key={item.issue}
                onClick={() => setActiveArticle(item)}
                className={`w-full text-left p-6 sm:p-8 hairline-b transition-colors ${
                  selected
                    ? 'bg-[var(--ink-primary)] text-[var(--bg-canvas)]'
                    : 'hover:bg-[var(--bg-sub)]'
                }`}
              >
                <div className="flex justify-between font-ledger text-[11px] opacity-75 mb-2">
                  <span>{item.issue}</span>
                  <span>{item.date} // {item.readTime}</span>
                </div>
                <h2 className="font-grotesk font-bold text-xl sm:text-2xl tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm opacity-80 leading-relaxed">
                  {item.excerpt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right 7 Columns: Full Monograph Plate */}
        <article className="lg:col-span-7 p-6 sm:p-12 lg:p-16 space-y-8">
          <div className="flex items-center justify-between font-ledger text-xs text-[var(--ink-muted)] pb-4 hairline-b">
            <span>{activeArticle.issue}</span>
            <span>FIELD REPORT // {activeArticle.readTime}</span>
          </div>

          <h2 className="font-editorial italic text-4xl sm:text-6xl leading-[1.02]">
            {activeArticle.title}
          </h2>

          <div className="aspect-[16/10] hairline-box overflow-hidden bg-[var(--bg-sub)]">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-full object-cover grayscale-[15%]"
            />
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[var(--ink-primary)] font-medium">
            {activeArticle.excerpt}
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-[var(--ink-secondary)]">
            {activeArticle.body}
          </p>
        </article>
      </section>
    </main>
  );
};

export default Journal;
