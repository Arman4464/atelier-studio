import { motion, type Variants } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "../../lib/format";
import { useCartStore } from "../../store/cartStore";
import { useProductsStore } from "../../store/productsStore";

const wordVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.06 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function KineticWord({ children, i }: { children: string; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-1 align-bottom">
      <motion.span custom={i} initial="hidden" animate="visible" variants={wordVariants} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const currency = useCartStore((s) => s.currency);
  const heroProduct = useProductsStore((s) => s.products.find((p) => p.id === 1));

  return (
    <section className="mx-auto grid max-w-[1800px] grid-cols-1 gap-1.5 p-1.5 pt-1.5 md:grid-cols-12 md:auto-rows-[minmax(0,1fr)]">
      {/* Headline tile */}
      <div className="flex flex-col justify-between border border-line bg-void-2 p-8 md:col-span-7 md:row-span-2 md:p-14">
        <div className="flex items-center gap-3">
          <span className="border border-line px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">Volume 04 — FW26</span>
          <span className="text-xs text-ink-dim">Lisbon Workshop</span>
        </div>

        <h1 className="my-10 font-display text-[clamp(2.6rem,7vw,6.2rem)] font-black uppercase leading-[0.92] tracking-tight text-ink">
          <KineticWord i={0}>Objects</KineticWord> <KineticWord i={1}>worth</KineticWord>
          <br />
          <span className="text-indigo-glow"><KineticWord i={2}>keeping.</KineticWord></span>
        </h1>

        <div className="flex flex-wrap items-center gap-6">
          <Link
            to="/shop"
            className="group flex items-center gap-3 bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow"
          >
            Explore Catalog
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <p className="max-w-[220px] text-xs leading-relaxed text-ink-dim">
            Six small runs a year. No seasons to chase, nothing made to be thrown away.
          </p>
        </div>
      </div>

      {/* Hero image tile */}
      <Link
        to="/product/1"
        className="group relative col-span-1 min-h-[320px] overflow-hidden border border-line md:col-span-5 md:row-span-2"
      >
        <img
          src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1400&auto=format&fit=crop"
          alt="Structured Wool Trench"
          className="absolute inset-0 h-full w-full object-cover saturate-[0.85] transition-all duration-1000 ease-out group-hover:scale-105 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/10 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-on-scrim">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-brass-bright">Hero Spotlight</span>
            <h3 className="font-display text-2xl font-bold">Structured Wool Trench</h3>
          </div>
          <span className="border border-on-scrim/30 px-3 py-1.5 font-mono text-xs backdrop-blur-sm">{formatPrice(heroProduct?.price, currency)}</span>
        </div>
      </Link>

      {/* Small tiles row */}
      <div className="flex flex-col justify-between border border-line bg-indigo p-6 md:col-span-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-void/70">Since 2016</span>
        <span className="font-display text-5xl font-black text-void">06</span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-void">Runs per year</span>
      </div>

      <Link
        to="/shop?cat=Objects"
        className="group relative col-span-1 min-h-[160px] overflow-hidden border border-line md:col-span-3"
      >
        <img
          src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop"
          alt="Objects"
          className="absolute inset-0 h-full w-full object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-scrim/50 transition-colors group-hover:bg-scrim/30" />
        <span className="absolute bottom-4 left-4 font-display text-xl font-bold text-on-scrim">Objects</span>
      </Link>

      <Link
        to="/shop?cat=Outerwear"
        className="group relative col-span-1 min-h-[160px] overflow-hidden border border-line md:col-span-3"
      >
        <img
          src="https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=800&auto=format&fit=crop"
          alt="Outerwear"
          className="absolute inset-0 h-full w-full object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-scrim/50 transition-colors group-hover:bg-scrim/30" />
        <span className="absolute bottom-4 left-4 font-display text-xl font-bold text-on-scrim">Outerwear</span>
      </Link>

      <div className="flex flex-col justify-between border border-line bg-paper p-6 text-onpaper md:col-span-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-onpaper-dim">Rated</span>
        <span className="font-display text-5xl font-black">4.8</span>
        <span className="text-[11px] font-semibold uppercase tracking-widest">Across 1,204 reviews</span>
      </div>
    </section>
  );
}
