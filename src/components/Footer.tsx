import { Link } from "react-router-dom";
import { useState } from "react";
import { useUIStore } from "../store/uiStore";
import { useCartStore } from "../store/cartStore";
import type { Currency } from "../lib/format";
import { ACTIVE_CURRENCIES, CURRENCY_LABELS } from "../lib/format";

export default function Footer() {
  const showToast = useUIStore((s) => s.showToast);
  const currency = useCartStore((s) => s.currency);
  const setCurrency = useCartStore((s) => s.setCurrency);
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!email.includes("@")) {
      showToast("Enter a valid email to subscribe");
      return;
    }
    showToast("Subscribed — check your inbox for 10% off");
    setEmail("");
  };

  return (
    <footer className="border-t border-line bg-void-2 pb-10 pt-20">
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-12 border-b border-line px-5 pb-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <h2 className="font-display text-6xl font-black uppercase tracking-tight text-ink md:text-8xl">Atelier</h2>
          <p className="mt-6 max-w-sm text-xs leading-relaxed text-ink-dim">
            Registered workshop: Rua da Boavista 84, 1200-068 Lisboa, Portugal. All designs &copy; ATELIER FW26.
          </p>
          <div className="mt-7 flex items-center gap-3">
            {["Instagram", "Pinterest", "LinkedIn"].map((s) => (
              <button
                key={s}
                onClick={() => showToast(`${s} isn't wired up in this demo`)}
                aria-label={s}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-[10px] text-ink-dim transition-colors hover:border-indigo-glow hover:text-ink"
              >
                {s[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs uppercase tracking-widest text-ink-dim md:col-span-2">
          <span className="mb-2 block text-[10px] font-semibold text-brass">Shop</span>
          <Link to="/shop" className="w-fit hover:text-ink">All Products</Link>
          <Link to="/shop?cat=Outerwear" className="w-fit hover:text-ink">Outerwear</Link>
          <Link to="/shop?cat=Knitwear" className="w-fit hover:text-ink">Knitwear</Link>
          <Link to="/shop?cat=Objects" className="w-fit hover:text-ink">Objects</Link>
        </div>

        <div className="flex flex-col gap-3 text-xs uppercase tracking-widest text-ink-dim md:col-span-2">
          <span className="mb-2 block text-[10px] font-semibold text-brass">Company</span>
          <Link to="/journal" className="w-fit hover:text-ink">Our Story</Link>
          <button onClick={() => showToast("Careers page coming with our FW26 relaunch.")} className="w-fit text-left hover:text-ink">Careers</button>
          <button onClick={() => showToast("Press kit available upon request.")} className="w-fit text-left hover:text-ink">Press Room</button>
          <button onClick={() => showToast("Sustainability report available upon request.")} className="w-fit text-left hover:text-ink">Sustainability</button>
        </div>

        <div className="md:col-span-3">
          <span className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-brass">Stay in the Loop</span>
          <div className="flex items-center border-b border-line pb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="w-full bg-transparent text-xs text-ink placeholder:text-ink-dim focus:outline-none"
            />
            <button onClick={subscribe} className="flex-shrink-0 text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
              Join
            </button>
          </div>
          <div className="mt-6 flex items-center gap-2 text-ink-dim">
            <span className="text-[9px] uppercase tracking-widest">Secure Checkout</span>
            <div className="flex gap-1.5">
              {["VISA", "MC", "AMEX", "PAY"].map((p) => (
                <span key={p} className="rounded border border-line px-1.5 py-0.5 font-mono text-[8px]">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1800px] flex-col items-start justify-between gap-4 px-5 pt-8 text-[10px] uppercase tracking-widest text-ink-dim md:flex-row md:items-center md:px-10">
        <span>&copy; 2026 Atelier Goods. All Rights Reserved.</span>
        <div className="flex items-center gap-6">
          <button onClick={() => showToast("Privacy policy available upon request.")} className="hover:text-ink">Privacy</button>
          <button onClick={() => showToast("Terms available upon request.")} className="hover:text-ink">Terms</button>
          <Link to="/admin/login" className="hover:text-ink">Admin</Link>
          <label className="flex items-center gap-2 normal-case">
            <span className="uppercase">Currency</span>
            {ACTIVE_CURRENCIES.length > 1 ? (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="border border-line bg-void-2 px-2 py-1 text-ink-dim focus:outline-none"
              >
                {ACTIVE_CURRENCIES.map((c) => (
                  <option key={c} value={c} className="bg-void">{CURRENCY_LABELS[c]}</option>
                ))}
              </select>
            ) : (
              <span className="text-ink-dim">{CURRENCY_LABELS[currency]}</span>
            )}
          </label>
        </div>
      </div>
    </footer>
  );
}
