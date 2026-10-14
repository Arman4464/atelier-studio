import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/FormField";
import { useAuthStore } from "../../store/authStore";
import { isValidEmail } from "../../lib/validators";

export const ForgotPassword: React.FC = () => {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoLink, setDemoLink] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const result = requestPasswordReset(email);
      setLoading(false);
      setSent(true);
      if (result) {
        setDemoLink(`/reset-password?token=${result.token}`);
      } else {
        setDemoLink(null);
      }
    }, 600);
  };

  if (sent) {
    return (
      <AuthShell eyebrow="Check Your Inbox" title="Reset Link Dispatched">
        <div className="flex flex-col items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300">
            <Mail size={20} />
          </div>
          <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
            If an account exists for <span className="font-semibold text-[var(--ink-primary)]">{email}</span>, we've dispatched a cryptographic reset link. It expires in 30 minutes.
          </p>

          <div className="w-full rounded-2xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-white/5 p-5 backdrop-blur-md">
            <p className="mb-3 text-[11px] leading-relaxed text-[var(--ink-muted)]">
              This is a demo store environment. Use this simulation shortcut:
            </p>
            {demoLink ? (
              <Link to={demoLink} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:underline">
                Continue to Reset Password &rarr;
              </Link>
            ) : (
              <p className="text-xs text-[var(--ink-muted)]">No account matches that email, so no token was generated.</p>
            )}
          </div>

          <Link to="/login" className="text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] underline underline-offset-2">
            Back to log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Account Recovery" title="Forgot Password" subtitle="Enter your client email address and we will dispatch a reset link.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={error} />
        <button
          type="submit"
          disabled={loading}
          className="btn-prism mt-2 flex w-full items-center justify-center gap-2 py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Dispatching..." : "Send Reset Link"}
        </button>
      </form>
      <p className="mt-8 text-center text-xs text-[var(--ink-secondary)]">
        <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
          Return to log in
        </Link>
      </p>
    </AuthShell>
  );
};

export default ForgotPassword;
