import type { Metadata } from 'next';

import { SuccessPage } from '@/modules/admissions/presentation/pages/success';

export const metadata: Metadata = {
  title: 'Admission Submitted',
  description: 'Admission submission success page.',
};

export default function Page({ searchParams }: { searchParams?: { gr?: string } }) {
  return <SuccessPage grToken={searchParams?.gr} />;
}
