import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { processSteps, workshopGallery, craftStations } from "../data/content";

export default function Journal() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <section className="grid grid-cols-1 border-b border-line lg:grid-cols-12">
        <div className="min-h-[60vh] lg:col-span-7">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
            alt="Inside the Atelier workshop, Lisbon"
            className="h-full w-full object-cover saturate-[0.85]"
          />
        </div>
        <div className="flex flex-col justify-center bg-void px-6 py-16 md:px-14 lg:col-span-5">
          <span className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Est. 2016, Lisboa</span>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.95] text-ink md:text-7xl">
            The Long <span className="text-indigo-glow">Way</span> Round
          </h1>
          <p className="mt-8 text-sm leading-relaxed text-ink-dim">
            ATELIER began as two people, a rented ground floor in Alfama, and a refusal to make anything that
            wouldn't survive its owner by twenty years. A decade later the workshop is bigger, but the rule hasn't
            moved: six collections a year, never more, each one held to the same question — will this still earn
            its place in ten years?
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] px-6 py-24 md:px-14">
        <div className="mb-16 text-center">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">How a Piece Is Made</span>
          <h2 className="font-display text-4xl font-black uppercase text-ink md:text-6xl">From Raw Material to Doorstep</h2>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          {processSteps.map((step) => (
            <div key={step.n}>
              <span className="mb-4 block font-display text-5xl font-black text-line">{step.n}</span>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-ink">{step.title}</h3>
              <p className="text-xs leading-relaxed text-ink-dim">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-1.5 border-y border-line p-1.5 md:grid-cols-3">
        {workshopGallery.map((img) => (
          <div key={img} className="aspect-[4/5] overflow-hidden">
            <img src={img} alt="Workshop detail" className="h-full w-full object-cover saturate-[0.85]" />
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1800px] px-6 py-24 md:px-14">
        <div className="mb-16">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">The Workshop</span>
          <h2 className="font-display text-4xl font-black uppercase text-ink md:text-6xl">Hands Behind the Work</h2>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {craftStations.map((station) => (
            <div key={station.name}>
              <div className="mb-4 aspect-[3/4] overflow-hidden border border-line bg-void-3">
                <img src={station.image} alt={station.name} className="h-full w-full object-cover saturate-[0.85]" />
              </div>
              <h3 className="font-display text-xl text-ink">{station.name}</h3>
              <p className="text-xs uppercase tracking-widest text-ink-dim">{station.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-void-2 py-24 text-center">
        <h2 className="mx-auto mb-8 max-w-xl font-display text-3xl font-bold text-ink md:text-5xl">
          Come see the current run before it's gone.
        </h2>
        <Link to="/shop" className="inline-block bg-ink px-8 py-5 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow">
          Shop Volume 04
        </Link>
      </section>
    </motion.div>
  );
}
