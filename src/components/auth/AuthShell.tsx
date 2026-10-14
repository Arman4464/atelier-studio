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
    <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-8 pt-28 pb-32 max-w-lg mx-auto">
      <div className="w-full glass-modal rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Soft Ambient Inner Glow */}
        <div className="text-center pb-6 border-b border-[var(--glass-border-subtle)] mb-7">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--ink-muted)] block mb-2 font-medium">
            {eyebrow || 'Client Access'}
          </span>
          <h1 className="font-editorial italic text-4xl sm:text-5xl font-normal leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-[var(--ink-secondary)] font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {footerText && footerLinkText && (
          <div className="mt-8 pt-6 border-t border-[var(--glass-border-subtle)] text-center text-xs text-[var(--ink-muted)]">
            <span>{footerText} </span>
            <Link
              to={footerLinkTo}
              className="font-medium text-[var(--ink-primary)] underline underline-offset-4 hover:opacity-75 transition-opacity"
            >
              {footerLinkText}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default AuthShell;
