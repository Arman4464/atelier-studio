export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 text-ink-dim">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-glow" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-glow [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-glow [animation-delay:300ms]" />
      </div>
    </div>
  );
}
