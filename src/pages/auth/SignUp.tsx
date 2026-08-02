import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { isValidEmail, passwordStrength } from "../../lib/validators";

export default function SignUp() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const signUp = useAuthStore((s) => s.signUp);
  const showToast = useUIStore((s) => s.showToast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter your full name";
    if (!email.trim()) next.email = "Enter your email";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Choose a password";
    else if (passwordStrength(password) < 1) next.password = "Password must be at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords don't match";
    if (!agreed) next.terms = "You need to accept the terms to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = signUp(name, email, password);
      setLoading(false);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      showToast(`Welcome to Atelier, ${name.split(" ")[0]}.`);
      navigate(params.get("redirect") || "/account");
    }, 600);
  };

  return (
    <AuthShell eyebrow="Join Atelier" title="Create Account" subtitle="Save addresses, track orders, and check out faster next time.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="Full Name" value={name} onChange={setName} required autoComplete="name" error={errors.name} />
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={errors.email} />
        <PasswordField label="Password" value={password} onChange={setPassword} required showStrength autoComplete="new-password" error={errors.password} />
        <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm} required autoComplete="new-password" error={errors.confirm} />

        <label className="flex items-start gap-3 text-xs text-ink-dim">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 border-line accent-indigo"
          />
          <span>
            I agree to the <span className="text-ink underline underline-offset-2">Terms of Service</span> and{" "}
            <span className="text-ink underline underline-offset-2">Privacy Policy</span>.
          </span>
        </label>
        {errors.terms && <p className="-mt-3 text-[11px] text-flame">{errors.terms}</p>}

        {formError && <p className="border border-flame/30 bg-flame/10 px-4 py-3 text-xs text-flame">{formError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-ink py-4 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-ink-dim">
        Already have an account?{" "}
        <Link to={`/login${params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : ""}`} className="text-ink underline underline-offset-2 hover:text-indigo-glow">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
