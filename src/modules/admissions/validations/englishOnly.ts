/**
 * English-only input constraint.
 * Allowed characters (per requirements): A–Z/a–z, 0–9, spaces, and common punctuation: - . , / ( )
 */
export const ENGLISH_ONLY_REGEX = /^[A-Za-z0-9\s\-.,/()]*$/;

export function isEnglishOnly(value: string): boolean {
  return ENGLISH_ONLY_REGEX.test(value);
}
