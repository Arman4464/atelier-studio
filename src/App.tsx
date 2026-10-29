import { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { SpatialEnvironment } from "./components/SpatialEnvironment";
import Footer from "./components/Footer";
import MobileNav from "./components/MobileNav";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import SearchModal from "./components/SearchModal";
import SizeGuideModal from "./components/SizeGuideModal";
import QuickView from "./components/QuickView";
import Toaster from "./components/Toaster";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PageLoader from "./components/PageLoader";
import PreloaderController from "./components/PreloaderController";
import Home from "./pages/Home";
import type { ShippingInfo } from "./pages/Checkout";
import { useUIStore } from "./store/uiStore";
import { useThemeStore } from "./store/themeStore";
import { useProductsStore } from "./store/productsStore";
import { useDiscountsStore } from "./store/discountsStore";
import { useCartStore } from "./store/cartStore";

const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Journal = lazy(() => import("./pages/Journal"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AccountLayout = lazy(() => import("./pages/account/AccountLayout"));
const AccountOverview = lazy(() => import("./pages/account/AccountOverview"));
const AccountOrders = lazy(() => import("./pages/account/AccountOrders"));
const OrderDetail = lazy(() => import("./pages/account/OrderDetail"));
const AccountWishlist = lazy(() => import("./pages/account/AccountWishlist"));
const AccountAddresses = lazy(() => import("./pages/account/AccountAddresses"));
const AccountPayment = lazy(() => import("./pages/account/AccountPayment"));
const AccountSettings = lazy(() => import("./pages/account/AccountSettings"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/AdminCustomerDetail"));
const AdminDiscounts = lazy(() => import("./pages/admin/AdminDiscounts"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function GlobalShortcuts({ isAdminRoute }: { isAdminRoute: boolean }) {
  const closeAll = useUIStore((s) => s.closeAll);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
      if (!isAdminRoute && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (!isAdminRoute && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === "l") {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          useThemeStore.getState().toggleLedgerXRay();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll, setSearchOpen, isAdminRoute]);

  // Synchronize state across multi-tabs
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (!e.key) return;
      useProductsStore.persist?.rehydrate();
      useDiscountsStore.persist?.rehydrate();
      useCartStore.persist?.rehydrate();
      useThemeStore.persist?.rehydrate();
    };
    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, []);

  return null;
}

function AmbientAuraWrapper({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setPos({ x, y });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="ambient-canvas min-h-screen relative overflow-x-hidden selection:bg-rose-200 selection:text-slate-900">
      {/* Live Cursor-Following Silk Gradient Orb */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 opacity-60 dark:opacity-80"
        style={{
          background: `radial-gradient(750px circle at ${pos.x}% ${pos.y}%, var(--aura-1), var(--aura-2) 40%, transparent 72%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function App() {
  const [lastOrder, setLastOrder] = useState<{ shipping: ShippingInfo | null; orderNumber: string }>({
    shipping: null,
    orderNumber: "",
  });
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AmbientAuraWrapper>
      <SpatialEnvironment />
      <ScrollToTop />
      <GlobalShortcuts isAdminRoute={isAdminRoute} />
      <PreloaderController />
      {!isAdminRoute && <Header />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/journal" element={<Journal />} />
            <Route
              path="/checkout"
              element={<Checkout onComplete={(shipping, orderNumber) => setLastOrder({ shipping, orderNumber })} />}
            />
            <Route
              path="/confirmation"
              element={<Confirmation shipping={lastOrder.shipping} orderNumber={lastOrder.orderNumber} />}
            />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountOverview />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="payment" element={<AccountPayment />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:customerId/:id" element={<AdminOrderDetail />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="customers/:id" element={<AdminCustomerDetail />} />
              <Route path="discounts" element={<AdminDiscounts />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}

      {!isAdminRoute && <MobileNav />}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <SizeGuideModal />
      <QuickView />
      <Toaster />
    </AmbientAuraWrapper>
  );
}
