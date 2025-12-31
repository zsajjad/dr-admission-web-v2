import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { firebaseConfig } from '@/config';

let firebaseApp: FirebaseApp | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;
  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return firebaseApp;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;

  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    const supported = await isSupported().catch(() => false);
    if (!supported) return null;
    return getAnalytics(getFirebaseApp());
  })();

  return analyticsPromise;
}

export async function trackPageView(page_path: string): Promise<void> {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;

  logEvent(analytics, 'page_view', {
    page_path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export async function trackException(description: string, fatal = false): Promise<void> {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;

  logEvent(analytics, 'exception', {
    description,
    fatal: Boolean(fatal),
  });
}
