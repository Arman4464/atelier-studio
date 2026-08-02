import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import { adminLinks } from "./adminNav";

export default function AdminMobileTabs() {
  return (
    <nav aria-label="Admin" className="flex gap-2 overflow-x-auto border-b border-line bg-void px-4 py-3 no-scrollbar lg:hidden">
      {adminLinks.map(({ to, label, icon: Icon, end }) => (
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
