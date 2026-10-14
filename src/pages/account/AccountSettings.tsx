import { useState } from "react";
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

export default function AccountSettings() {
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
    if (!confirm("Delete your account? This can't be undone in this demo either.")) return;
    logOut();
    showToast("Account removed");
    navigate("/");
  };

  return (
    <div className="max-w-2xl">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-indigo-glow">Account</span>
      <h1 className="font-display text-4xl font-black uppercase text-ink md:text-5xl">Settings</h1>

      <section className="mt-12">
        <h2 className="mb-5 font-display text-xl font-bold text-ink">Profile</h2>
        <form onSubmit={saveProfile} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Full Name" value={name} onChange={setName} required error={profileErrors.name} />
          <FormField label="Phone" value={phone} onChange={setPhone} placeholder="Optional" />
          <FormField label="Email" type="email" span2 value={email} onChange={setEmail} required error={profileErrors.email} />
          <label className="flex items-center gap-3 text-xs text-ink-dim sm:col-span-2">
            <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="h-4 w-4 border-line accent-indigo" />
            Send me new-release &amp; workshop-note emails
          </label>
          <button type="submit" className="w-fit bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow sm:col-span-2">
            Save Changes
          </button>
        </form>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 font-display text-xl font-bold text-ink">Change Password</h2>
        <form onSubmit={savePassword} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <PasswordField label="Current Password" span2 value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" error={passwordErrors.currentPassword} />
          <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} showStrength autoComplete="new-password" error={passwordErrors.newPassword} />
          <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" error={passwordErrors.confirmPassword} />
          {passwordSuccess && <p className="text-xs text-indigo-glow sm:col-span-2">Password updated successfully.</p>}
          <button type="submit" className="w-fit bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-void transition-colors hover:bg-indigo-glow sm:col-span-2">
            Update Password
          </button>
        </form>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 font-display text-xl font-bold text-ink">Preferences</h2>
        <div className="divide-y divide-line border border-line">
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink">Currency</p>
              <p className="text-xs text-ink-dim">Applies across the whole store</p>
            </div>
            {ACTIVE_CURRENCIES.length > 1 ? (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="border border-line bg-transparent px-3 py-2 text-xs text-ink focus:outline-none focus:border-indigo-glow"
              >
                {ACTIVE_CURRENCIES.map((c) => (
                  <option key={c} value={c} className="bg-void">{CURRENCY_LABELS[c]}</option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-ink-dim">{CURRENCY_LABELS[currency]}</span>
            )}
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-ink">Appearance</p>
              <p className="text-xs text-ink-dim">Switch between dark and light</p>
            </div>
            <button
              onClick={toggleTheme}
              className="border border-line px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink hover:border-indigo-glow"
            >
              {isDark ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-14 border border-flame/30 p-6">
        <h2 className="mb-2 font-display text-lg font-bold text-flame">Danger Zone</h2>
        <p className="mb-5 text-xs text-ink-dim">Deleting your account removes it from this browser's demo storage.</p>
        <button onClick={deleteAccount} className="border border-flame px-6 py-3 text-xs font-semibold uppercase tracking-widest text-flame transition-colors hover:bg-flame hover:text-on-flame">
          Delete Account
        </button>
      </section>
    </div>
  );
}
