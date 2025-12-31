'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { trackPageView } from '@/platform/Firebase/client';
import { initFirebaseErrorLogging } from '@/platform/Firebase/errorLogging';

export function FirebaseObserver() {
  const pathname = usePathname();

  // Initialize runtime error capture once (client-side only).
  useEffect(() => {
    initFirebaseErrorLogging();
  }, []);

  // Track route changes (App Router client navigation).
  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const pagePath = `${pathname}${search}`;
    void trackPageView(pagePath);
  }, [pathname]);

  return null;
}
