import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Heart, ShoppingBag, Sun, Moon, User } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore, userInitials } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { getAnnouncements } from "../data/content";
import { formatPrice } from "../lib/format";

export default function Header() {
  const cartCount = useCartStore((s) => s.cartCount());
  const wishlistCount = useCartStore((s) => s.wishlist.length);
  const currency = useCartStore((s) => s.currency);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setWishlistOpen = useUIStore((s) => s.setWishlistOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.currentUser());
  const freeShippingThreshold = useSettingsStore((s) => s.freeShippingThreshold);

  const announcements = useMemo(
    () => getAnnouncements(formatPrice(freeShippingThreshold, currency)),
    [freeShippingThreshold, currency]
  );

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  const [annIndex, setAnnIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAnnIndex((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(t);
  }, [announcements.length]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY.current && y > 220);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="bg-indigo py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-on-indigo">
        {announcements[annIndex]}
      </div>
      <header className={`w-full border-b transition-all duration-500 ${scrolled ? "glass border-line py-3" : "border-transparent bg-void/40 py-5 backdrop-blur-sm"}`}>
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-5 md:px-10">
          <button onClick={() => setMobileNavOpen(true)} aria-label="Open menu" className="flex items-center md:hidden">
            <Menu size={20} className="text-ink" />
          </button>

          <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-dim md:flex" aria-label="Primary">
            <Link to="/shop" className="transition-colors hover:text-ink">Shop</Link>
            <Link to="/shop?cat=Outerwear" className="transition-colors hover:text-ink">Outerwear</Link>
            <Link to="/shop?cat=Objects" className="transition-colors hover:text-ink">Objects</Link>
            <Link to="/journal" className="transition-colors hover:text-ink">Journal</Link>
          </nav>

          <Link to="/" className="font-display text-2xl font-black uppercase tracking-tight text-ink md:text-3xl">
            Atelier<span className="text-indigo-glow">.</span>
          </Link>

          <div className="flex items-center gap-4 text-ink md:gap-6">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="transition-colors hover:text-indigo-glow"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="transition-colors hover:text-indigo-glow">
              <Search size={18} />
            </button>
            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "Your account" : "Log in"}
              className="flex items-center justify-center transition-colors hover:text-indigo-glow"
            >
              {user ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo text-[10px] font-bold text-on-indigo">
                  {userInitials(user.name)}
                </span>
              ) : (
                <User size={18} />
              )}
            </Link>
            <button onClick={() => setWishlistOpen(true)} aria-label="Wishlist" className="relative transition-colors hover:text-indigo-glow">
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-flame text-[9px] font-bold text-on-flame">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} aria-label="Bag" className="relative transition-colors hover:text-indigo-glow">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-glow text-[9px] font-bold text-void">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
