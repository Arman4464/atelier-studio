import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminMobileTabs from "../../components/admin/AdminMobileTabs";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function AdminLayout() {
  const logOut = useAuthStore((s) => s.logOut);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    showToast("Signed out of admin.");
    navigate("/");
  };

  return (
    <div className="mx-auto grid max-w-[1800px] grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-line lg:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-between border-b border-line bg-void-2 px-5 py-3 lg:hidden">
          <Link to="/admin" className="font-display text-lg font-black uppercase text-ink">
            Atelier <span className="text-indigo-glow">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Back to store" className="text-ink-dim hover:text-ink">
              <ArrowLeft size={16} />
            </Link>
            <button onClick={handleLogout} aria-label="Log out" className="text-ink-dim hover:text-flame">
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <AdminMobileTabs />
        <div className="px-5 py-8 md:px-8 md:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
