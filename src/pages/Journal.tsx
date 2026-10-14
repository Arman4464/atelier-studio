import React, { useState } from 'react';

const MONOGRAPHS = [
  {
    issue: 'Monograph N° 01',
    date: 'Autumn 2026',
    readTime: '4 min read',
    title: 'On Loomstate Selvedge & The Beauty of Irregular Tension',
    excerpt:
      'Why vintage shuttle looms in Okayama produce microscopic slub variations that modern air-jet looms erased from industrial fashion.',
    body: 'Modern textile engineering prizes speed and uniformity above all else. High-speed projectile looms fire weft yarns across warps at thousands of meters per minute, stripping the cloth of character. In our Autumn—Winter archive, we returned to 1950s Toyoda shuttle looms where wooden bobbins travel back and forth under low tension, preserving the organic density of raw cotton.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  },
  {
    issue: 'Monograph N° 02',
    date: 'Resort 2026',
    readTime: '6 min read',
    title: 'Cold-Vat Iron Oxide & Botanical Dye Immersion',
    excerpt:
      'Documenting our 4-hour pigment immersion baths in Biella using fermented walnut husks, iron mordants, and rainwater.',
    body: 'Synthetic reactive dyes lock flat color onto the surface of a garment. Mineral and botanical immersion works differently: the pigment bonds unevenly with the natural oils of virgin wool and heavy duck canvas, creating living surfaces that lighten along high-friction seams.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
  },
  {
    issue: 'Monograph N° 03',
    date: 'Summer 2026',
    readTime: '5 min read',
    title: 'Pattern Cutting as Structural Cantilever',
    excerpt:
      'Adapting 1940s French railway workwear gussets and bias-cut raglan sleeves for unrestricted kinetic movement.',
    body: 'When a coat relies on shoulder pads for structure, it fights the wearer. By rotating the sleeve pitch forward 12 degrees and inserting a single-piece underarm gusset, heavy 540 GSM wool hangs from the collarbone like a suspension bridge.',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85',
  },
];

export const Journal: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState(MONOGRAPHS[0]);

  return (
    <main className="min-h-screen pt-28 pb-36 px-5 sm:px-10 max-w-[1440px] mx-auto">
      {/* Editorial Header */}
      <header className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
          Textile Research & Craft
        </span>
        <h1 className="font-editorial italic text-5xl sm:text-7xl font-normal tracking-tight">
          Atelier Monographs
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[var(--ink-secondary)] font-light">
          Observations on heritage loomstate weaving, botanical dye chemistry, and architectural pattern cutting.
        </p>
      </header>

      {/* Spatial Broadside Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Monograph Selector */}
        <div className="lg:col-span-5 space-y-4">
          {MONOGRAPHS.map((item) => {
            const isSelected = activeArticle.issue === item.issue;
            return (
              <button
                key={item.issue}
                onClick={() => setActiveArticle(item)}
                className={`w-full text-left p-6 sm:p-8 rounded-[28px] transition-all ${
                  isSelected
                    ? 'glass-island shadow-lg scale-[1.01]'
                    : 'bg-[var(--bg-sub)] hover:bg-[var(--bg-sub)]/80'
                }`}
              >
                <div className="flex justify-between text-xs text-[var(--ink-muted)] mb-2 font-medium">
                  <span>{item.issue}</span>
                  <span>{item.date} · {item.readTime}</span>
                </div>
                <h3 className="font-editorial italic text-2xl sm:text-3xl leading-snug text-[var(--ink-primary)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[var(--ink-secondary)] line-clamp-2 font-light leading-relaxed">
                  {item.excerpt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Featured Reading Canvas */}
        <article className="lg:col-span-7 glass-island rounded-[36px] p-8 sm:p-14 space-y-8">
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
            <span className="font-medium">{activeArticle.issue}</span>
            <span>{activeArticle.readTime}</span>
          </div>

          <h2 className="font-editorial italic text-4xl sm:text-6xl leading-[1.04] text-[var(--ink-primary)]">
            {activeArticle.title}
          </h2>

          <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-[var(--bg-sub)]">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[var(--ink-primary)] font-medium">
            {activeArticle.excerpt}
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-[var(--ink-secondary)] font-light">
            {activeArticle.body}
          </p>
        </article>
      </div>
    </main>
  );
};

export default Journal;
