import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  quote?: string;
}

export default function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
  quote = "Six small runs a year. No seasons to chase, nothing made to be thrown away.",
}: AuthShellProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid min-h-[calc(100vh-92px)] grid-cols-1 md:min-h-[calc(100vh-100px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-line lg:block">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover saturate-[0.8]" />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/30 to-scrim/10" />
        <div className="absolute inset-x-10 bottom-10 text-on-scrim">
          <Link to="/" className="font-display text-2xl font-black uppercase tracking-tight">
            Atelier<span className="text-indigo-glow">.</span>
          </Link>
          <p className="mt-6 max-w-sm font-display text-2xl font-light leading-snug">&ldquo;{quote}&rdquo;</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 md:px-14">
        <div className="w-full max-w-sm">
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">{eyebrow}</span>
          <h1 className="font-display text-4xl font-black uppercase leading-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-3 text-sm text-ink-dim">{subtitle}</p>}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
