import { useState } from "react";
import { useUIStore } from "../../store/uiStore";

export default function Newsletter() {
  const showToast = useUIStore((s) => s.showToast);
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      showToast("Enter a valid email to subscribe");
      return;
    }
    showToast("Subscribed — check your inbox for 10% off");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-[1800px] px-1.5 pb-1.5">
      <div className="relative overflow-hidden border border-line bg-indigo px-6 py-20 text-center md:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-glow/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-void/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <span className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-void/70">Journal Dispatch</span>
          <h2 className="mb-4 font-display text-4xl font-black uppercase leading-none text-void md:text-6xl">
            Get 10% off your first order
          </h2>
          <p className="mx-auto mb-10 max-w-md text-sm text-void/70">
            One dispatch a month: new small-batch releases, workshop notes, and nothing else.
          </p>
          <form onSubmit={subscribe} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 border border-void/30 bg-transparent px-5 py-4 text-sm text-void placeholder:text-void/50 focus:outline-none focus:border-void"
            />
            <button type="submit" className="bg-void px-7 py-4 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-onpaper">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
