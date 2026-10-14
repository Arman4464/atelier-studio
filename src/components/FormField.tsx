import React from 'react';
import { cn } from '../lib/cn';

export interface FormFieldProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  mono?: boolean;
  span2?: boolean;
  maxLength?: number;
  autoComplete?: string;
  id?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      value,
      onChange,
      type = 'text',
      placeholder,
      error,
      hint,
      required,
      mono,
      span2,
      maxLength,
      autoComplete,
      id,
      rightElement,
      className,
      ...rest
    },
    ref
  ) => {
    const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'input';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (typeof onChange === 'function') {
        try {
          (onChange as any)(e.target.value);
        } catch {
          (onChange as any)(e);
        }
      }
    };

    return (
      <div className={cn('space-y-1.5 w-full', span2 && 'sm:col-span-2')}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-xs font-medium tracking-wide text-[var(--ink-secondary)] pl-1"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={fieldId}
            type={type}
            value={value}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onChange={handleChange}
            className={cn(
              'glass-input',
              mono && 'font-mono text-xs',
              error && 'border-rose-400 focus:ring-rose-400/30',
              rightElement && 'pr-11',
              className
            )}
            {...rest}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-[var(--ink-muted)]">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 pl-1 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[11px] text-[var(--ink-muted)] pl-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
export default FormField;
