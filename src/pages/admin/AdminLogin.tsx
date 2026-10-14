import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, ShieldCheck } from "lucide-react";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { isValidEmail } from "../../lib/validators";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const logIn = useAuthStore((s) => s.logIn);
  const isAdminUser = useAuthStore((s) => s.isAdminUser);
  const loginAsAdmin = useAuthStore((s) => s.loginAsAdmin);
  const showToast = useUIStore((s) => s.showToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = params.get("redirect") || "/admin";

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
      if (!isAdminUser()) {
        setFormError("That account does not have administrator privileges.");
        useAuthStore.getState().logOut();
        return;
      }
      showToast("Welcome back, Administrator.");
      navigate(redirect);
    }, 500);
  };

  const tryDemo = () => {
    loginAsAdmin();
    showToast("Signed in to the administrator console.");
    navigate(redirect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-md">
        <div className="glass-modal rounded-[36px] p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <ShieldCheck size={26} />
            </div>
            <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Internal Command
            </span>
            <h1 className="font-display text-3xl font-light tracking-tight text-[var(--ink-primary)]">
              Admin Access
            </h1>
            <p className="mt-2 text-xs text-[var(--ink-secondary)] max-w-xs">
              Authenticate with credential authority to manage collections and orders.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={errors.email} />
            <PasswordField label="Password" value={password} onChange={setPassword} required autoComplete="current-password" error={errors.password} />

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
              {loading ? "Authenticating..." : "Enter Command Center"}
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
            Authenticate with Admin Demo
          </button>

          <p className="mt-8 text-center text-xs text-[var(--ink-muted)]">
            <Link to="/" className="hover:text-[var(--ink-primary)] underline underline-offset-2 transition-colors">
              Return to storefront
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
