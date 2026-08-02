export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export function passwordStrength(value: string): PasswordStrength {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4) as PasswordStrength;
}

export const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  0: "Too short",
  1: "Weak",
  2: "Okay",
  3: "Good",
  4: "Strong",
};

export const STRENGTH_COLOR: Record<PasswordStrength, string> = {
  0: "bg-flame",
  1: "bg-flame",
  2: "bg-zest",
  3: "bg-indigo-glow",
  4: "bg-indigo-glow",
};

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required`;
}
