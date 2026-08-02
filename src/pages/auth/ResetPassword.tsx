import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { passwordStrength } from "../../lib/validators";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const showToast = useUIStore((s) => s.showToast);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <AuthShell eyebrow="Reset Password" title="Link Missing">
        <p className="text-sm leading-relaxed text-ink-dim">
          This page needs a reset token from the link we sent you. Request a new one below.
        </p>
        <Link to="/forgot-password" className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-indigo-glow hover:text-ink">
          Request a new link &rarr;
        </Link>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell eyebrow="All Set" title="Password Updated">
        <div className="flex flex-col items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-glow text-void">
            <Check size={20} />
          </div>
          <p className="text-sm leading-relaxed text-ink-dim">Your password has been reset. Log in with your new password.</p>
          <Link to="/login" className="bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow">
            Go to Log In
          </Link>
        </div>
      </AuthShell>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const next: Record<string, string> = {};
    if (!password) next.password = "Choose a new password";
    else if (passwordStrength(password) < 1) next.password = "Password must be at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      const result = resetPassword(token, password);
      setLoading(false);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      showToast("Password updated — please log in.");
      setDone(true);
    }, 500);
  };

  return (
    <AuthShell eyebrow="Almost Done" title="Set New Password" subtitle="Choose something you haven't used before.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <PasswordField label="New Password" value={password} onChange={setPassword} required showStrength autoComplete="new-password" error={errors.password} />
        <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm} required autoComplete="new-password" error={errors.confirm} />
        {formError && <p className="border border-flame/30 bg-flame/10 px-4 py-3 text-xs text-flame">{formError}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
}
