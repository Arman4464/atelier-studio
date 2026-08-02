import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../lib/cn";
import { passwordStrength, STRENGTH_LABEL, STRENGTH_COLOR } from "../lib/validators";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  required?: boolean;
  showStrength?: boolean;
  autoComplete?: string;
  id?: string;
  span2?: boolean;
}

export default function PasswordField({
  label,
  value,
  onChange,
  error,
  required,
  showStrength,
  autoComplete = "current-password",
  id,
  span2,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");
  const strength = showStrength ? passwordStrength(value) : null;

  return (
    <label htmlFor={fieldId} className={cn("flex flex-col gap-2", span2 && "sm:col-span-2")}>
      <span className="text-[10px] uppercase tracking-widest text-ink-dim">
        {label}
        {required && <span className="text-flame"> *</span>}
      </span>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          required={required}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full border bg-transparent px-4 py-3 pr-11 text-sm text-ink transition-colors focus:outline-none",
            error ? "border-flame focus:border-flame" : "border-line focus:border-indigo-glow"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-ink-dim hover:text-ink"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {showStrength && value.length > 0 && strength !== null && (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength - 1 ? STRENGTH_COLOR[strength] : "bg-line")} />
            ))}
          </div>
          <span className="w-14 flex-shrink-0 text-[10px] text-ink-dim">{STRENGTH_LABEL[strength]}</span>
        </div>
      )}

      {error && (
        <span id={`${fieldId}-error`} className="text-[11px] text-flame">
          {error}
        </span>
      )}
    </label>
  );
}
