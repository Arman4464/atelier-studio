import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Manifesto() {
  return (
    <section className="relative mx-auto min-h-[560px] max-w-[1800px] overflow-hidden border border-line">
      <img
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
        alt="Inside the Atelier workshop"
        className="absolute inset-0 h-full w-full object-cover saturate-[0.7]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-scrim via-scrim/70 to-scrim/10" />

      <div className="relative z-10 flex h-full min-h-[560px] items-center px-6 py-16 md:px-16">
        <div className="glass max-w-xl p-8 md:p-12">
          <span className="mb-6 block text-[10px] font-semibold uppercase tracking-widest text-brass">Our Craft Manifesto</span>
          <h2 className="font-display text-3xl font-bold leading-[1.08] text-ink md:text-5xl">
            In an era of fleeting velocity, we anchor our practice in deliberate slowness and tactile honesty.
          </h2>
          <div className="mt-10 flex items-center justify-between border-t border-line-soft pt-6">
            <div>
              <span className="block font-display text-lg font-bold text-ink">Manuel Da Silva</span>
              <span className="text-xs uppercase tracking-widest text-ink-dim">Head of Design, Lisbon</span>
            </div>
            <Link to="/journal" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
              Read the story <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
