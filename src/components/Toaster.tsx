import React from 'react';
import { useUIStore } from '../store/uiStore';

export const Toaster: React.FC = () => {
  const uiStore = useUIStore() as any;
  const toasts: any[] = uiStore.toasts || [];
  const dismissToast = uiStore.dismissToast || uiStore.removeToast;

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t: any) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[var(--ink-primary)] text-[var(--bg-canvas)] p-4 hairline-box shadow-xl font-ledger text-xs flex items-start justify-between gap-4"
        >
          <div>
            <div className="text-[10px] text-[var(--accent-stamp)] font-bold uppercase">
              // ATELIER DISPATCH NOTICE
            </div>
            <div className="mt-1 uppercase">{t.message || t.title}</div>
          </div>
          {dismissToast && (
            <button
              onClick={() => dismissToast(t.id)}
              className="opacity-70 hover:opacity-100 text-[10px]"
            >
              [✕]
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toaster;
