import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { isValidEmail } from "../../lib/validators";

export default function Login() {
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
    <AuthShell eyebrow="Welcome Back" title="Log In" subtitle="Sign in to view your orders, wishlist and saved details.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={errors.email} />
        <PasswordField label="Password" value={password} onChange={setPassword} required autoComplete="current-password" error={errors.password} />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-ink-dim">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 border-line accent-indigo" />
            Stay signed in
          </label>
          <Link to="/forgot-password" className="text-ink-dim underline underline-offset-2 hover:text-ink">
            Forgot password?
          </Link>
        </div>

        {formError && <p className="border border-flame/30 bg-flame/10 px-4 py-3 text-xs text-flame">{formError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Signing In..." : "Log In"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4 text-[10px] uppercase tracking-widest text-ink-dim">
        <div className="h-px flex-1 bg-line" />
        or
        <div className="h-px flex-1 bg-line" />
      </div>

      <button
        onClick={tryDemo}
        className="w-full border border-line py-4 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:border-indigo-glow hover:text-indigo-glow"
      >
        Continue with Demo Account
      </button>
      <p className="mt-3 text-center text-[11px] text-ink-dim">Instantly explore the dashboard with sample orders &amp; addresses.</p>

      <p className="mt-8 text-center text-xs text-ink-dim">
        New to Atelier?{" "}
        <Link to={`/signup${params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : ""}`} className="text-ink underline underline-offset-2 hover:text-indigo-glow">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
