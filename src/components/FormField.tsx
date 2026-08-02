import { cn } from "../lib/cn";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  mono?: boolean;
  span2?: boolean;
  maxLength?: number;
  autoComplete?: string;
  id?: string;
}

export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  required,
  mono,
  span2,
  maxLength,
  autoComplete,
  id,
}: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={fieldId} className={cn("flex flex-col gap-2", span2 && "sm:col-span-2")}>
      <span className="text-[10px] uppercase tracking-widest text-ink-dim">
        {label}
        {required && <span className="text-flame"> *</span>}
      </span>
      <input
        id={fieldId}
        type={type}
        required={required}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border bg-transparent px-4 py-3 text-sm text-ink transition-colors focus:outline-none",
          mono && "font-mono",
          error ? "border-flame focus:border-flame" : "border-line focus:border-indigo-glow"
        )}
      />
      {error && (
        <span id={`${fieldId}-error`} className="text-[11px] text-flame">
          {error}
        </span>
      )}
    </label>
  );
}
