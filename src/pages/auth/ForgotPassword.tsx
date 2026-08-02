import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/FormField";
import { useAuthStore } from "../../store/authStore";
import { isValidEmail } from "../../lib/validators";

export default function ForgotPassword() {
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
      <AuthShell eyebrow="Check Your Inbox" title="Reset Link Sent">
        <div className="flex flex-col items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-glow text-void">
            <Mail size={20} />
          </div>
          <p className="text-sm leading-relaxed text-ink-dim">
            If an account exists for <span className="text-ink">{email}</span>, we've sent a link to reset the password. It expires in 30 minutes.
          </p>

          <div className="w-full border border-line bg-void-2 p-5">
            <p className="mb-3 text-[11px] leading-relaxed text-ink-dim">
              This is a demo store — no email actually gets sent. Use this link to continue as if you'd received it:
            </p>
            {demoLink ? (
              <Link to={demoLink} className="text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
                Continue to Reset Password &rarr;
              </Link>
            ) : (
              <p className="text-xs text-ink-dim">No account matches that email, so no link was generated.</p>
            )}
          </div>

          <Link to="/login" className="text-xs text-ink-dim underline underline-offset-2 hover:text-ink">
            Back to log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Trouble Signing In" title="Forgot Password" subtitle="Enter the email on your account and we'll send a reset link.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={error} />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p className="mt-8 text-center text-xs text-ink-dim">
        <Link to="/login" className="text-ink underline underline-offset-2 hover:text-indigo-glow">
          Back to log in
        </Link>
      </p>
    </AuthShell>
  );
}
