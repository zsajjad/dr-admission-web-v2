const CAPTCHA_TOKEN_STORAGE_KEY = 'dr.captchaToken';

export function setCaptchaToken(token: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(CAPTCHA_TOKEN_STORAGE_KEY, token);
}

export function getCaptchaToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(CAPTCHA_TOKEN_STORAGE_KEY);
}

export function clearCaptchaToken() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(CAPTCHA_TOKEN_STORAGE_KEY);
}
