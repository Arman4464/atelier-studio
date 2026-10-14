import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { useCartStore } from "../../store/cartStore";
import { useThemeStore } from "../../store/themeStore";
import FormField from "../../components/FormField";
import PasswordField from "../../components/PasswordField";
import { isValidEmail, passwordStrength } from "../../lib/validators";
import type { Currency } from "../../lib/format";
import { ACTIVE_CURRENCIES, CURRENCY_LABELS } from "../../lib/format";

export const AccountSettings: React.FC = () => {
  const user = useAuthStore((s) => s.currentUser());
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);
  const logOut = useAuthStore((s) => s.logOut);
  const showToast = useUIStore((s) => s.showToast);
  const currency = useCartStore((s) => s.currency);
  const setCurrency = useCartStore((s) => s.setCurrency);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [newsletter, setNewsletter] = useState(user?.newsletter ?? true);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!user) return null;

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter your full name";
    if (!email.trim() || !isValidEmail(email)) next.email = "Enter a valid email address";
    setProfileErrors(next);
    if (Object.keys(next).length > 0) return;

    updateProfile({ name, email, phone, newsletter });
    showToast("Profile updated");
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(false);
    const next: Record<string, string> = {};
    if (!currentPassword) next.currentPassword = "Enter your current password";
    if (!newPassword) next.newPassword = "Choose a new password";
    else if (passwordStrength(newPassword) < 1) next.newPassword = "Password must be at least 8 characters";
    if (confirmPassword !== newPassword) next.confirmPassword = "Passwords don't match";
    setPasswordErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setPasswordErrors({ currentPassword: result.error });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
    showToast("Password changed");
  };

  const deleteAccount = () => {
    if (!confirm("Delete your account? This will erase local storage state.")) return;
    logOut();
    showToast("Account removed");
    navigate("/");
  };

  return (
    <div className="max-w-2xl space-y-12">
      <div>
        <span className="mb-2 block text-[10px] font-mono font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
          Private Client
        </span>
        <h1 className="font-display text-4xl font-light italic text-[var(--ink-primary)] md:text-5xl">Profile &amp; Settings</h1>
      </div>

      <section className="glass-card rounded-[28px] p-6 sm:p-8">
        <h2 className="mb-5 font-display text-2xl font-light text-[var(--ink-primary)]">Personal Details</h2>
        <form onSubmit={saveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Full Name" value={name} onChange={setName} required error={profileErrors.name} />
          <FormField label="Phone" value={phone} onChange={setPhone} placeholder="Optional" />
          <FormField label="Email" type="email" span2 value={email} onChange={setEmail} required error={profileErrors.email} />
          <label className="flex items-center gap-3 text-xs text-[var(--ink-secondary)] sm:col-span-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="h-4 w-4 rounded-md border-black/10 dark:border-white/10 accent-purple-600"
            />
            Receive seasonal monographs and studio release dispatches
          </label>
          <div className="sm:col-span-2 pt-3">
            <button type="submit" className="btn-prism px-7 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider">
              Save Changes
            </button>
          </div>
        </form>
      </section>

      <section className="glass-card rounded-[28px] p-6 sm:p-8">
        <h2 className="mb-5 font-display text-2xl font-light text-[var(--ink-primary)]">Security Passkey</h2>
        <form onSubmit={savePassword} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordField label="Current Password" span2 value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" error={passwordErrors.currentPassword} />
          <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} showStrength autoComplete="new-password" error={passwordErrors.newPassword} />
          <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" error={passwordErrors.confirmPassword} />
          {passwordSuccess && (
            <p className="text-xs font-medium text-emerald-500 sm:col-span-2">Password successfully updated.</p>
          )}
          <div className="sm:col-span-2 pt-3">
            <button type="submit" className="btn-prism px-7 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider">
              Update Password
            </button>
          </div>
        </form>
      </section>

      <section className="glass-card rounded-[28px] overflow-hidden divide-y divide-black/5 dark:divide-white/10">
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-semibold text-[var(--ink-primary)]">Valuation Currency</p>
            <p className="text-xs text-[var(--ink-muted)]">Applied globally across all plates</p>
          </div>
          {ACTIVE_CURRENCIES.length > 1 ? (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="glass-pill px-4 py-2 text-xs font-semibold uppercase text-[var(--ink-primary)]"
            >
              {ACTIVE_CURRENCIES.map((c) => (
                <option key={c} value={c} className="bg-void dark:bg-zinc-900">{CURRENCY_LABELS[c]}</option>
              ))}
            </select>
          ) : (
            <span className="text-xs font-mono text-[var(--ink-secondary)]">{CURRENCY_LABELS[currency]}</span>
          )}
        </div>
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-semibold text-[var(--ink-primary)]">Visual Atmosphere</p>
            <p className="text-xs text-[var(--ink-muted)]">Alabaster daylight or smoked obsidian night</p>
          </div>
          <button
            onClick={toggleTheme}
            className="glass-pill px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--ink-primary)] hover:border-purple-500/30"
          >
            {isDark ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-rose-500/20 bg-rose-500/5 p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-rose-500">Danger Zone</h2>
        <p className="mb-5 text-xs text-[var(--ink-secondary)]">
          Terminating your client dossier will clear your local cached credentials and active simulated orders.
        </p>
        <button
          onClick={deleteAccount}
          className="rounded-2xl border border-rose-500/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
        >
          Erase Dossier
        </button>
      </section>
    </div>
  );
};

export default AccountSettings;
