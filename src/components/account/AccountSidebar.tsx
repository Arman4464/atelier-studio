import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore, userInitials } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { cn } from "../../lib/cn";
import { accountLinks } from "./accountNav";

export default function AccountSidebar() {
  const user = useAuthStore((s) => s.currentUser());
  const logOut = useAuthStore((s) => s.logOut);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logOut();
    showToast("Signed out. Come back soon.");
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line p-6">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-indigo text-sm font-bold text-on-indigo">
          {userInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-ink-dim">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4" aria-label="Account">
        {accountLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors",
                isActive ? "bg-indigo text-on-indigo" : "text-ink-dim hover:bg-void-2 hover:text-ink"
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink-dim transition-colors hover:bg-flame/10 hover:text-flame"
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </div>
  );
}
