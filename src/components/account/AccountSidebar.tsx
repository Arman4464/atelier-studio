import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore, userInitials } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { cn } from "../../lib/cn";
import { accountLinks } from "./accountNav";

export const AccountSidebar: React.FC = () => {
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
    <div className="flex h-full flex-col p-2">
      <div className="flex items-center gap-3 p-4 border-b border-black/5 dark:border-white/10 mb-2">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-sm font-semibold text-white shadow-md">
          {userInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--ink-primary)]">{user.name}</p>
          <p className="truncate text-xs font-mono text-[var(--ink-muted)]">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 p-2" aria-label="Account">
        {accountLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200",
                isActive
                  ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/20 shadow-xs"
                  : "text-[var(--ink-secondary)] hover:bg-white/40 dark:hover:bg-white/5 hover:text-[var(--ink-primary)]"
              )
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 pt-4 border-t border-black/5 dark:border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide text-rose-500 transition-colors hover:bg-rose-500/10"
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;
