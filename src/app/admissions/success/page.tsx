import type { Metadata } from 'next';

import { AdmissionSuccessPage } from './success-page';

export const metadata: Metadata = {
  title: 'Admission Submitted',
  description: 'Admission submission success page.',
};

export default function Page({ searchParams }: { searchParams?: { gr?: string } }) {
  return <AdmissionSuccessPage grToken={searchParams?.gr} />;
}
