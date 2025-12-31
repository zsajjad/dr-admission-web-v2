export type LegacyLookupTokenV1 = {
  v: 1;
  /**
   * The legacy lookup query (typically GR number, or any query backend supports).
   * We keep it as "query" so we can resolve via the existing `/admissions/search/legacy` endpoint.
   */
  query: string;
};

function toBase64Url(input: string): string {
  // btoa is available in browsers; for safety in non-browser contexts we just return input.
  if (typeof window === 'undefined' || typeof window.btoa !== 'function') return input;
  const base64 = window.btoa(input);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string): string {
  if (typeof window === 'undefined' || typeof window.atob !== 'function') return input;
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLen);
  return window.atob(padded);
}

export function encodeLegacyLookupToken(query: string): string {
  const payload: LegacyLookupTokenV1 = { v: 1, query };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeLegacyLookupToken(token: string): LegacyLookupTokenV1 | null {
  try {
    const json = fromBase64Url(token);
    const parsed = JSON.parse(json) as Partial<LegacyLookupTokenV1>;
    if (parsed?.v !== 1) return null;
    if (typeof parsed.query !== 'string' || !parsed.query.trim()) return null;
    return { v: 1, query: parsed.query };
  } catch {
    return null;
  }
}
