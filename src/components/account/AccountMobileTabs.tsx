import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import { accountLinks } from "./accountNav";

export const AccountMobileTabs: React.FC = () => {
  return (
    <nav
      aria-label="Account"
      className="flex gap-2 overflow-x-auto p-4 border-b border-black/5 dark:border-white/10 no-scrollbar lg:hidden"
    >
      {accountLinks.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200",
              isActive
                ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold border border-purple-500/20 shadow-xs"
                : "glass-pill text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            )
          }
        >
          <Icon size={13} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default AccountMobileTabs;
