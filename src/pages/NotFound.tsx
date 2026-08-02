import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <span className="mb-4 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Error 404</span>
      <h1 className="font-display text-[clamp(4rem,14vw,10rem)] font-black leading-none text-line">404</h1>
      <p className="mt-4 max-w-sm font-display text-2xl font-light text-ink">This piece isn't in the catalog.</p>
      <p className="mt-3 max-w-sm text-sm text-ink-dim">
        The page you're looking for may have been moved, retired at the end of a run, or never existed.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/" className="bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow">
          Back to Home
        </Link>
        <Link to="/shop" className="border border-line px-7 py-4 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow">
          Browse Catalog
        </Link>
      </div>
    </motion.div>
  );
}
