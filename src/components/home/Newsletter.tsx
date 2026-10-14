import React, { useState } from 'react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setRegistered(true);
    setEmail('');
  };

  return (
    <section className="py-20 px-5 sm:px-10 max-w-[1440px] mx-auto">
      <div className="rounded-[36px] glass-island p-8 sm:p-14 lg:p-20 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-3">
            Private Atelier Register
          </span>
          <h2 className="font-editorial italic text-4xl sm:text-6xl font-normal tracking-tight leading-tight">
            Receive Notice of Limited Editions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[var(--ink-secondary)] font-light leading-relaxed">
            We produce numbered small-batch releases with zero synthetic overproduction. Receive private lookbook previews 24 hours prior to public release.
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          {registered ? (
            <div className="p-6 rounded-2xl bg-[var(--bg-sub)] text-center">
              <span className="font-editorial italic text-2xl block mb-1">
                Welcome to Atelier
              </span>
              <p className="text-xs text-[var(--ink-secondary)]">
                You will receive private notification prior to the upcoming seasonal release.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address..."
                className="w-full px-5 py-3.5 rounded-full bg-[var(--bg-sub)] text-sm placeholder:text-[var(--ink-muted)] focus:outline-none text-[var(--ink-primary)]"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full bg-[var(--ink-primary)] text-[var(--bg-canvas)] text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shrink-0 shadow-md"
              >
                Join →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
