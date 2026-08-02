# ATELIER — Concept Store

A from-scratch rebuild of the Atelier ecommerce template as a proper React application: componentized, typed, and state-managed, instead of one long HTML file. Includes full account creation/login, a real customer dashboard, a branded loading screen, and a fully functional admin panel that actually drives the storefront.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Build tool | **Vite 8** | Instant HMR, fast cold starts, first-class TS support |
| Framework | **React 19** + **TypeScript** | Component reuse, type safety across product/cart/account/admin data |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`, via `@tailwindcss/vite`) | Design tokens defined once in `src/index.css`, no separate config file |
| Routing | **React Router v7** | Client-side routing, nested routes for the customer and admin dashboards, lazy-loaded route chunks |
| State | **Zustand** (+ `persist` middleware) | Products, cart/wishlist/currency, auth/accounts, discounts, store settings, and UI (drawers/modals/toasts) — small independent stores, no boilerplate |
| Charts | **Recharts** | Admin analytics — isolated into its own lazy-loaded chunk so the customer storefront never downloads it |
| Motion | **Motion** (formerly Framer Motion) | Page transitions, drawer/modal animation, kinetic headline reveal, FAQ accordion |
| Icons | **lucide-react** | Consistent line-icon set |

## Design direction

The visual system was rebuilt from zero: a near-black "void" canvas, an electric-indigo primary accent, brass and zest-yellow as secondary accents, set in **Archivo** (display, black weight) / **Instrument Sans** (body) / **JetBrains Mono** (price & SKU data). The homepage uses an asymmetric bento grid instead of a stacked hero, product photography desaturates slightly at rest and blooms to full color on hover/focus, and drawers/modals use a frosted-glass treatment (`backdrop-filter`) instead of flat overlays. The admin panel intentionally looks different — dense tables, a fixed sidebar, functional over kinetic — while reusing the exact same color tokens, so it reads as the same product rather than a bolted-on tool.

### Dark / light mode

Dark is the default theme. A sun/moon toggle in the header (`src/store/themeStore.ts`) switches to a light "cream" theme — the original linen/stone palette — by adding a `.light` class to `<html>`. The choice is saved to `localStorage` and restored on reload with no flash (a small blocking script in `index.html` applies it before first paint).

This works with zero per-component changes because every color utility in the project (`bg-void`, `text-ink`, `border-line`, …) compiles to `var(--color-*)` under Tailwind v4 — retheming is just overriding those custom properties once in `src/index.css`. A few colors are intentionally *not* theme-linked and stay fixed regardless of mode:

- `--color-scrim` / `--color-on-scrim` — the dark gradient/overlay and light text used on top of product photography (a photo needs a dark fade for its caption whether the site chrome around it is light or dark).
- `--color-on-indigo` / `--color-on-zest` / `--color-on-flame` — text sitting on saturated badge backgrounds (New/Bestseller/low-stock tags), tuned per-background rather than per-theme.
- `--color-brass-bright` — the one brass label that sits permanently on the dark scrim (hero spotlight caption), as opposed to the theme-aware `--color-brass` used for section eyebrows on the page canvas.

All color pairs were checked against WCAG AA contrast ratios in both themes before shipping.

### Loading screen

A branded preloader (`ATELIER.` mark, animated progress line) lives in `index.html` as static HTML/CSS — it paints before any JS runs, so there's no blank white/black flash on first visit. It respects the saved theme (cream or void) and `prefers-reduced-motion`, holds for a minimum ~550ms so it never flickers, and is removed by `src/components/PreloaderController.tsx` once React has mounted. This only affects hard page loads — in-app navigation between routes doesn't re-trigger it; lazy-loaded route chunks show the smaller inline `PageLoader` instead.

### Currency

This is an India-based store, so **INR is the only currency shown** — every product price, shipping threshold, and order total is stored natively in rupees (`src/data/products.ts`, `src/store/settingsStore.ts`), not converted from USD. The currency *picker* in the footer and account settings only renders when more than one currency is available; with just INR active it shows a plain "INR ₹" label instead of a pointless one-option dropdown.

The multi-currency plumbing is still fully in place for whenever you want to expand — nothing about it was removed, just parked:

- `src/lib/format.ts` exports `Currency` (`"INR" | "USD" | "EUR" | "GBP"`), a `RATES` table already populated for all four (INR as the 1:1 base), and `ACTIVE_CURRENCIES` — the single array that controls what shoppers can actually pick.
- To open up a new currency: add it to `ACTIVE_CURRENCIES`. The footer/settings picker reappears automatically, `formatPrice()` already knows how to convert and symbol-format it, and no other file needs to change.
- Rates in `RATES` are a hand-set snapshot (not a live feed) — same as most storefronts that don't wire up real-time FX. Update them directly, or swap in a live rate API behind `formatPrice()` if you need accuracy at the moment of sale.

### Accounts

Sign up, log in, forgot/reset password, and a full account dashboard — all backed by `src/store/authStore.ts`, a mock "backend" persisted to `localStorage` (see **Wiring up a real backend** below for what to swap out).

- **Auth pages** (`src/pages/auth/`): Sign Up, Log In, Forgot Password, Reset Password. Real client-side validation, password strength meter, show/hide toggle, loading states, and a **"Continue with Demo Account"** button on Login that signs you in as a seeded user with sample order history, addresses, and cards — so the dashboard isn't empty on first look.
- **Account dashboard** (`src/pages/account/`, routed under `/account`, protected by `src/components/ProtectedRoute.tsx`): Overview (stats + recent orders), Orders (full history + detail page with a status timeline and **Reorder**), Wishlist (same data as the header wishlist drawer), Addresses (add/edit/delete/set default), Payment Methods (masked, demo-only — see note below), and Settings (profile, change password, currency/theme preferences, delete account).
- **Checkout integration**: logged-in users see their saved addresses/cards as quick-select chips at checkout, and completed orders are written to their account order history automatically. Guests still get a full guest checkout — logging in is offered, never required.
- Forgot Password is deliberately honest about being a demo: since there's no real email delivery, the "email sent" screen gives you a direct link to continue the flow instead of asking you to check a real inbox.

### Admin panel

A separate, fully functional admin dashboard at `/admin` — not a mockup. Everything an admin changes actually drives the storefront a shopper sees, because both sides read from the same Zustand stores:

- **Dashboard** (`/admin`) — revenue (6-month area chart), total orders, customers, average order value, a low-stock alert banner, recent orders, and top products by units sold.
- **Orders** (`/admin/orders`) — every order across every customer, searchable and filterable by status, with a detail page that has a **working status control** (Processing → Shipped → Delivered) — change it here and the customer sees the update on their own order history immediately.
- **Products** (`/admin/products`) — full CRUD. Add, edit, or delete a product and it's live on the storefront (shop grid, homepage, search, product page) instantly, because the storefront reads from `productsStore` rather than a static file.
- **Customers** (`/admin/customers`) — every registered account, sorted by lifetime spend, with a detail view showing their order history and saved addresses.
- **Discounts** (`/admin/discounts`) — create real promo codes (percentage or fixed amount, optional expiry and usage limit). A code created here works immediately in the cart drawer and at checkout — there's no hardcoded `WELCOME10` anymore, it's just the first seeded row in `discountsStore`.
- **Analytics** (`/admin/analytics`) — orders by status (donut), revenue by category and top products by revenue (bar charts), all derived from real order data.
- **Settings** (`/admin/settings`) — store name, support email, free shipping threshold, and standard shipping cost. Change the threshold here and the cart's free-shipping progress bar and checkout math update immediately. Also includes a **Reset Demo Data** button that clears everything back to the original seed if you want a clean slate after testing.

Admin access is gated by an `isAdmin` flag on the account (`src/components/AdminRoute.tsx`), completely separate from the customer `ProtectedRoute`. Sign in at `/admin/login` — email `admin@atelier.com` / password `admin1234`, or use the **"Continue with Admin Demo"** shortcut. The seed data includes five customer accounts with a realistic spread of order dates/statuses so the dashboard and analytics have something meaningful to show on first load, not empty charts.


## Project structure

```
src/
  components/         Reusable UI: Header, Footer, ProductCard, drawers, modals, Toaster, PreloaderController...
  components/home/    Homepage-only sections (Hero, KeyPieces, Manifesto, Testimonials...)
  components/auth/    AuthShell (shared two-column layout for customer auth pages)
  components/account/ Customer dashboard UI: sidebar nav, mobile tabs, order status badge
  components/admin/   Admin dashboard UI: sidebar nav, mobile tabs, stat cards
  pages/              Route-level pages: Home, Shop, ProductDetail, Journal, Checkout, Confirmation, NotFound
  pages/auth/         SignUp, Login, ForgotPassword, ResetPassword
  pages/account/      AccountLayout + Overview/Orders/OrderDetail/Wishlist/Addresses/Payment/Settings
  pages/admin/        AdminLogin, AdminLayout + Dashboard/Orders/OrderDetail/Products/ProductForm/Customers/CustomerDetail/Discounts/Analytics/Settings
  store/              Zustand stores — see table below
  data/               Seed product catalog + static site copy (FAQs, testimonials...)
  lib/                formatPrice, cn, form validators, chart color palette
```

| Store | Persisted? | Holds |
|---|---|---|
| `productsStore` | Yes | The live product catalog. Storefront and admin both read/write this — it's what makes admin product edits real. |
| `cartStore` | Yes (cart/wishlist/currency only) | Cart, wishlist, applied discount, derived totals |
| `authStore` | Yes | All accounts (customers + admin), addresses, payment methods, order history |
| `discountsStore` | Yes | Promo codes — validated for real at checkout via `redeem()` |
| `settingsStore` | Yes | Store name, support email, shipping threshold/cost |
| `uiStore` | No | Drawer/modal open state, toast queue |
| `themeStore` | Yes | Dark/light preference |

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
```

## Building for production

```bash
npm run build      # outputs to dist/, routes are code-split automatically
npm run preview    # serves dist/ locally to sanity-check the build
```

`dist/` is fully static — deploy it to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host / CDN. There is no backend: accounts, cart, wishlist and orders all live in `localStorage` on the visitor's own browser. Nobody else can see them, and clearing site data resets everything (including the seeded demo account back to its original state on next load).

## Wiring up a real backend

Everything a real store needs is already isolated behind a few seams:

1. **`src/store/productsStore.ts`** — replace the `products` state (currently seeded from `src/data/products.ts`) with real fetches to your product API/CMS, and point `addProduct`/`updateProduct`/`deleteProduct` at real mutation endpoints instead of local `set()` calls. The `Product` type is the contract to keep. Because both the storefront and the admin panel already read from this one store, nothing else needs to change once it's backed by a real API.
2. **`src/store/authStore.ts`** — replace `signUp`/`logIn`/`requestPasswordReset`/`resetPassword` with real API calls (this is where you'd add JWTs/session cookies instead of a `currentUserId` in `localStorage`), and drop the plaintext `password` field from the `Account` type entirely — it only exists here because there's nothing else to check against in a static demo. The `isAdmin` flag should move to a real role check on your backend rather than a client-trusted field.
3. **`src/store/discountsStore.ts`** — `redeem()` currently just checks the code client-side. A real implementation validates and decrements usage server-side at checkout time, so two customers can't both redeem the last use of a limited code in a race.
4. **`src/pages/Checkout.tsx`** — `placeOrder()` currently just generates a fake order number, saves it to `authStore` if logged in, and clears the cart. Swap that for a real request to your payment provider (Stripe, Adyen, etc.) and order API.
5. **`src/pages/account/AccountPayment.tsx`** and **`src/pages/admin/AdminOrderDetail.tsx`** — card entry never sends a full card number anywhere (only brand + last 4 + expiry are kept, and only in `localStorage`). Wire this up to your payment provider's tokenization (e.g. Stripe Elements) rather than collecting raw PANs yourself. Order status updates in the admin panel are a good place to trigger real fulfillment emails/webhooks once there's a backend to call.

## Notes

- Product photography is sourced from Unsplash (free-license placeholder images) — swap in real product photography before shipping.
- Fonts load from Google Fonts (`index.html`); self-host them if you need to work offline or drop the external request.
- `WELCOME10` (10% off) is a working demo promo code, seeded in `discountsStore` — create more from `/admin/discounts`.
- Customer demo login: `demo@atelier.com` / `demo1234` (or the one-click button on `/login`).
- Admin demo login: `admin@atelier.com` / `admin1234` (or the one-click button on `/admin/login`).
- If you've been testing and want a clean slate, `/admin/settings` has a **Reset Demo Data** button.
- All persisted stores are versioned (`version: 1` in the `persist()` config, storage keys suffixed `-v2`). If you ever change seed data shape again, bump the version and/or rename the key — otherwise visitors with older `localStorage` will keep seeing stale data (an account that predates a feature, prices in an old currency, etc.) since `persist` prefers their saved state over your new seed by default.

