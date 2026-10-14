import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { isValidEmail, passwordStrength } from "../../lib/validators";

export const SignUp: React.FC = () => {
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
    <AuthShell eyebrow="Join Atelier" title="Create Account" subtitle="Save addresses, track garment provenance, and enjoy priority access.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField label="Full Name" value={name} onChange={setName} required autoComplete="name" error={errors.name} />
        <FormField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" error={errors.email} />
        <PasswordField label="Password" value={password} onChange={setPassword} required showStrength autoComplete="new-password" error={errors.password} />
        <PasswordField label="Confirm Password" value={confirm} onChange={setConfirm} required autoComplete="new-password" error={errors.confirm} />

        <label className="flex items-start gap-3 text-xs text-[var(--ink-secondary)] pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-md border-black/10 dark:border-white/10 accent-purple-600"
          />
          <span>
            I agree to the <span className="underline underline-offset-2 hover:text-[var(--ink-primary)]">Terms of Service</span> and{" "}
            <span className="underline underline-offset-2 hover:text-[var(--ink-primary)]">Privacy Policy</span>.
          </span>
        </label>
        {errors.terms && <p className="-mt-2 text-[11px] text-rose-500 font-medium">{errors.terms}</p>}

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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-[var(--ink-secondary)]">
        Already have an account?{" "}
        <Link
          to={`/login${params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : ""}`}
          className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignUp;
