import React from 'react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  eyebrow,
  children,
  footerText,
  footerLinkText,
  footerLinkTo = '/login',
}) => {
  return (
    <main className="min-h-[82vh] grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg-canvas)]">
      {/* Left Specimen Plate */}
      <div className="hidden lg:flex lg:col-span-6 bg-[var(--bg-sub)] hairline-r p-12 flex-col justify-between">
        <div className="font-ledger text-xs uppercase text-[var(--ink-muted)]">
          ATELIER STUDIO // PRIVATE CLIENTELE REGISTRY
        </div>
        <div className="my-auto max-w-md space-y-4">
          <h2 className="font-editorial italic text-5xl leading-none">
            Personal garment provenance & archive history.
          </h2>
          <p className="font-ledger text-xs text-[var(--ink-secondary)] leading-relaxed">
            Access your past waybills, saved pattern proportions, and private batch reservations.
          </p>
        </div>
        <div className="font-ledger text-[11px] text-[var(--ink-muted)]">
          SECURITY PROTOCOL // TLS ENCRYPTED DOSSIER
        </div>
      </div>

      {/* Right Credentials Ledger */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-[var(--bg-elevated)] hairline-box p-8 sm:p-10">
          <div className="pb-4 perforated-b mb-6">
            <span className="font-ledger text-[10px] uppercase tracking-widest text-[var(--accent-stamp)]">
              {eyebrow ? `// ${eyebrow.toUpperCase()}` : '// CREDENTIAL VERIFICATION'}
            </span>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl uppercase mt-1">
              {title}
            </h1>
            {subtitle && (
              <p className="font-ledger text-xs text-[var(--ink-secondary)] mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {children}

          {(footerText || footerLinkText) && (
            <div className="mt-6 pt-4 hairline-t font-ledger text-xs text-[var(--ink-secondary)] flex items-center justify-between">
              <span>{footerText}</span>
              {footerLinkText && (
                <Link to={footerLinkTo} className="underline text-[var(--ink-primary)] font-bold">
                  {footerLinkText} →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthShell;
