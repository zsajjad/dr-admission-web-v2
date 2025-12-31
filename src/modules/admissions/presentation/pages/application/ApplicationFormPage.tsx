'use client';

import { useSearchParams } from 'next/navigation';

import { LegacyAdmissionApplication } from './LegacyAdmissionApplication';
import { NewAdmissionApplication } from './NewAdmissionApplication';

export function ApplicationFormPage() {
  const searchParams = useSearchParams();
  const legacyToken = searchParams.get('legacy');

  return legacyToken ? <LegacyAdmissionApplication legacyToken={legacyToken} /> : <NewAdmissionApplication />;
}
