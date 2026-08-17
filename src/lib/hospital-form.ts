/** Shared client-side form helpers for hospital admin screens. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Accepts Saudi-friendly phone strings with optional +966 / spaces / dashes. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d+]/g, "");
  const normalized = digits.startsWith("+")
    ? digits.slice(1)
    : digits;
  return normalized.length >= 9 && normalized.length <= 15;
}

export function validateRequired(
  fields: Record<string, string>,
): string | null {
  for (const [label, value] of Object.entries(fields)) {
    if (!isNonEmpty(value)) {
      return `${label} is required.`;
    }
  }
  return null;
}
