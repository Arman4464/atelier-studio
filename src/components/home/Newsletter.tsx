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
    <section className="hairline-b grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 hairline-r">
        <span className="font-ledger text-xs uppercase tracking-widest text-[var(--ink-muted)]">
          // PRIVATE CLIENTELE DISPATCH
        </span>
        <h2 className="font-grotesk font-extrabold text-3xl sm:text-5xl uppercase tracking-tight mt-2">
          Receive Notice of <br />
          <span className="font-editorial italic font-normal lowercase text-[var(--accent-stamp)]">
            numbered dye lots.
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[var(--ink-secondary)] max-w-xl">
          We release small-batch garments without paid advertising. Register your dossier address for private archive access 24 hours before public indexing.
        </p>
      </div>

      <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 bg-[var(--bg-sub)] flex flex-col justify-center">
        {registered ? (
          <div className="p-6 bg-[var(--bg-elevated)] hairline-box font-ledger text-xs space-y-2">
            <div className="text-[var(--accent-stamp)] font-bold">[ DOSSIER REGISTERED ]</div>
            <p className="text-[var(--ink-secondary)]">
              Your coordinates have been logged for the next edition release.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3 font-ledger text-xs">
            <label className="block uppercase text-[var(--ink-secondary)]">
              ELECTRONIC DOSSIER ADDRESS:
            </label>
            <div className="flex items-stretch">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NAME@ARCHIVEDOMAIN.COM"
                className="w-full px-4 py-4 bg-[var(--bg-canvas)] hairline-box focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 bg-[var(--ink-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent-stamp)] transition-colors uppercase tracking-widest shrink-0 font-medium"
              >
                STAMP →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
