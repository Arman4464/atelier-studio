import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useAuthStore, userInitials } from "../store/authStore";
import { CATEGORIES } from "../data/products";

export default function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);
  const setWishlistOpen = useUIStore((s) => s.setWishlistOpen);
  const user = useAuthStore((s) => s.currentUser());
  const logOut = useAuthStore((s) => s.logOut);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    setOpen(false);
    showToast("Signed out. Come back soon.");
    navigate("/");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-scrim/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute left-0 top-0 flex h-full w-full max-w-xs flex-col overflow-y-auto p-8"
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="font-display text-2xl font-black uppercase text-ink">Atelier</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-ink-dim hover:text-ink">
                <X size={20} />
              </button>
            </div>

            {user ? (
              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="mb-8 flex items-center gap-3 border border-line p-4 transition-colors hover:border-indigo-glow"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo text-xs font-bold text-on-indigo">
                  {userInitials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                  <p className="text-[11px] uppercase tracking-widest text-ink-dim">View Account</p>
                </div>
              </Link>
            ) : (
              <div className="mb-8 flex gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 border border-line py-3 text-center text-xs font-semibold uppercase tracking-widest text-ink hover:border-indigo-glow">
                  Log In
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 bg-ink py-3 text-center text-xs font-semibold uppercase tracking-widest text-void hover:bg-indigo-glow">
                  Sign Up
                </Link>
              </div>
            )}

            <nav className="flex flex-col gap-5 font-display text-4xl font-bold text-ink">
              <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
              <Link to="/journal" onClick={() => setOpen(false)}>Journal</Link>
              <button
                className="text-left"
                onClick={() => {
                  setOpen(false);
                  setWishlistOpen(true);
                }}
              >
                Wishlist
              </button>
            </nav>
            <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?cat=${cat}`}
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-widest text-ink-dim hover:text-ink"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {user && (
              <button onClick={handleLogout} className="mt-8 flex items-center gap-2 border-t border-line pt-8 text-xs uppercase tracking-widest text-flame">
                <LogOut size={14} /> Log Out
              </button>
            )}

            <div className="mt-auto pt-8 text-xs uppercase tracking-widest text-ink-dim">
              Lisbon / Paris / Kyoto
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
