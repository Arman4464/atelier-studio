import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { passwordStrength } from "../../lib/validators";

export const ResetPassword: React.FC = () => {
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
      <AuthShell eyebrow="Reset Password" title="Token Missing">
        <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
          This session requires a valid security token. Please request a new recovery link.
        </p>
        <Link to="/forgot-password" className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:underline">
          Request a new link &rarr;
        </Link>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell eyebrow="Security Verified" title="Password Updated">
        <div className="flex flex-col items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
            <Check size={20} />
          </div>
          <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">Your security credentials have been updated. Sign in with your new credentials.</p>
          <Link to="/login" className="btn-prism px-7 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider">
            Proceed to Log In
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
    <AuthShell eyebrow="Security Update" title="Set New Password" subtitle="Choose a strong, unique passkey for your account.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <PasswordField label="New Password" value={password} onChange={setPassword} required showStrength autoComplete="new-password" error={errors.password} />
        <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm} required autoComplete="new-password" error={errors.confirm} />
        
        {formError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-500 font-medium">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-prism mt-2 flex w-full items-center justify-center gap-2 py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
