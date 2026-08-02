import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import { accountLinks } from "./accountNav";

export default function AccountMobileTabs() {
  return (
    <nav aria-label="Account" className="flex gap-2 overflow-x-auto border-b border-line bg-void px-4 py-3 no-scrollbar lg:hidden">
      {accountLinks.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex flex-shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors",
              isActive ? "bg-indigo text-on-indigo" : "border border-line text-ink-dim"
            )
          }
        >
          <Icon size={13} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
