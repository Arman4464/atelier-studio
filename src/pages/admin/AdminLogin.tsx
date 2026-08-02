import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, ShieldCheck } from "lucide-react";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { isValidEmail } from "../../lib/validators";

export default function AdminLogin() {
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
        setFormError("That account doesn't have admin access.");
        useAuthStore.getState().logOut();
        return;
      }
      showToast("Welcome back, Admin.");
      navigate(redirect);
    }, 500);
  };

  const tryDemo = () => {
    loginAsAdmin();
    showToast("Signed in to the admin demo account.");
    navigate(redirect);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex min-h-screen items-center justify-center bg-void-2 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo text-on-indigo">
            <ShieldCheck size={22} />
          </div>
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Staff Only</span>
          <h1 className="font-display text-3xl font-black uppercase text-ink">Admin Access</h1>
          <p className="mt-2 text-xs text-ink-dim">Sign in with an administrator account to manage the store.</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 border border-line bg-void p-7">
          <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={errors.email} />
          <PasswordField label="Password" value={password} onChange={setPassword} required autoComplete="current-password" error={errors.password} />

          {formError && <p className="border border-flame/30 bg-flame/10 px-4 py-3 text-xs text-flame">{formError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-widest text-ink-dim">
          <div className="h-px flex-1 bg-line" />
          or
          <div className="h-px flex-1 bg-line" />
        </div>

        <button
          onClick={tryDemo}
          className="w-full border border-line py-4 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow"
        >
          Continue with Admin Demo
        </button>

        <p className="mt-8 text-center text-xs text-ink-dim">
          <Link to="/" className="underline underline-offset-2 hover:text-ink">
            Back to storefront
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
