import React from 'react';
import { useUIStore } from '../store/uiStore';

export const Toaster: React.FC = () => {
  const uiStore = useUIStore() as any;
  const toasts: any[] = uiStore.toasts || [];
  const dismissToast = uiStore.dismissToast || uiStore.removeToast;

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t: any) => (
        <div
          key={t.id}
          className="pointer-events-auto glass-pill rounded-full px-5 py-3 shadow-xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 animate-pulse" />
            <span className="font-medium text-[var(--ink-primary)]">{t.message || t.title}</span>
          </div>
          {dismissToast && (
            <button
              onClick={() => dismissToast(t.id)}
              className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
