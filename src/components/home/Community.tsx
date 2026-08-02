import { communityShots } from "../../data/content";
import { useUIStore } from "../../store/uiStore";

export default function Community() {
  const showToast = useUIStore((s) => s.showToast);

  return (
    <section className="mx-auto max-w-[1800px] px-1.5 py-1.5">
      <div className="mb-6 flex items-end justify-between px-4 pt-10 md:px-6">
        <div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">@atelier.goods</span>
          <h2 className="font-display text-4xl font-black uppercase text-ink md:text-6xl">As Worn, In the Wild</h2>
        </div>
        <button
          onClick={() => showToast("Instagram isn't wired up in this demo")}
          className="hidden text-xs font-semibold uppercase tracking-widest text-ink-dim hover:text-ink sm:block"
        >
          Follow Along
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
        {communityShots.map((shot) => (
          <button
            key={shot.handle}
            onClick={() => showToast(`Community shot from ${shot.handle}`)}
            className="group relative aspect-square overflow-hidden border border-line"
          >
            <img src={shot.image} alt={`Customer photo by ${shot.handle}`} className="h-full w-full object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-105 group-hover:saturate-100" />
            <div className="absolute inset-0 flex items-end bg-scrim/0 p-4 opacity-0 transition-colors group-hover:bg-scrim/50 group-hover:opacity-100">
              <span className="text-xs font-medium text-on-scrim">{shot.handle}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
