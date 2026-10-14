import React from "react";
import { communityShots } from "../../data/content";
import { useUIStore } from "../../store/uiStore";

export const Community: React.FC = () => {
  const showToast = useUIStore((s) => s.showToast);

  return (
    <section className="py-20 px-5 sm:px-10 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
            @atelier.studio
          </span>
          <h2 className="font-editorial italic text-4xl sm:text-6xl font-normal leading-tight">
            As Worn Across the World
          </h2>
        </div>
        <button
          onClick={() => showToast("Curated lookbook gallery by patrons")}
          className="self-start sm:self-end px-5 py-2.5 rounded-full glass-pill text-xs font-medium hover:bg-[var(--ink-primary)] hover:text-[var(--bg-canvas)] transition-colors"
        >
          Follow @atelier.studio ↗
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {communityShots.map((shot) => (
          <button
            key={shot.handle}
            onClick={() => showToast(`Lookbook entry by ${shot.handle}`)}
            className="group relative aspect-[3/4] overflow-hidden rounded-[26px] bg-[var(--bg-sub)] text-left"
          >
            <img
              src={shot.image}
              alt={`Lookbook photo by ${shot.handle}`}
              className="h-full w-full object-cover sculptural-img"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex items-end">
              <span className="px-3.5 py-1.5 rounded-full glass-pill text-xs font-medium text-white border-white/20">
                {shot.handle}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Community;
