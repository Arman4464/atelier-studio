import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { isValidEmail } from "../../lib/validators";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const logIn = useAuthStore((s) => s.logIn);
  const loginAsDemo = useAuthStore((s) => s.loginAsDemo);
  const showToast = useUIStore((s) => s.showToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = params.get("redirect") || "/account";

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Enter your email";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = logIn(email, password);
      setLoading(false);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      showToast("Welcome back.");
      navigate(redirect);
    }, 500);
  };

  const tryDemo = () => {
    loginAsDemo();
    showToast("Signed in as the demo account.");
    navigate(redirect);
  };

  return (
    <AuthShell eyebrow="Welcome Back" title="Client Sign In" subtitle="Access your orders, saved curation, and tailored preferences.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={errors.email} />
        <PasswordField label="Password" value={password} onChange={setPassword} required autoComplete="current-password" error={errors.password} />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-[var(--ink-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded-md border-black/10 dark:border-white/10 accent-purple-600"
            />
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-[var(--ink-secondary)] hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
            Forgot password?
          </Link>
        </div>

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
          {loading ? "Signing In..." : "Sign In to Studio"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)]">
        <div className="h-px flex-1 bg-black/5 dark:bg-white/10" />
        or
        <div className="h-px flex-1 bg-black/5 dark:bg-white/10" />
      </div>

      <button
        onClick={tryDemo}
        className="glass-pill w-full py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)] transition-all hover:border-purple-500/30"
      >
        Explore with Demo Client
      </button>
      <p className="mt-3 text-center text-[11px] text-[var(--ink-muted)]">
        Instantly enter with pre-filled orders &amp; addresses.
      </p>

      <p className="mt-8 text-center text-xs text-[var(--ink-secondary)]">
        New to Atelier?{" "}
        <Link
          to={`/signup${params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : ""}`}
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
