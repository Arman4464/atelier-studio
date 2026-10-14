import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../lib/cn";
import { passwordStrength, STRENGTH_LABEL, STRENGTH_COLOR } from "../lib/validators";

export interface PasswordFieldProps {
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

export function PasswordField({
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
    <div className={cn("space-y-1.5 w-full", span2 && "sm:col-span-2")}>
      <label htmlFor={fieldId} className="block text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
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
            "glass-input pr-11",
            error && "border-rose-400 focus:ring-rose-400/30"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3.5 flex items-center text-[var(--ink-muted)] hover:text-[var(--ink-primary)] transition-colors"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {showStrength && value.length > 0 && strength !== null && (
        <div className="flex items-center gap-2 pt-1 pl-1">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= strength - 1 ? STRENGTH_COLOR[strength] : "bg-[var(--glass-border-subtle)]"
                )}
              />
            ))}
          </div>
          <span className="w-14 flex-shrink-0 text-[10px] text-[var(--ink-muted)] font-medium">
            {STRENGTH_LABEL[strength]}
          </span>
        </div>
      )}

      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-rose-500 pl-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordField;
