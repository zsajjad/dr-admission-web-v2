import type { Metadata } from 'next';

import { SuccessPage } from '@/modules/admissions/presentation/pages/success';

export const metadata: Metadata = {
  title: 'درخواست جمع ہوگئی',
  description: 'درخواست جمع ہوگئی',
};

export default function Page({ searchParams }: { searchParams?: { gr?: string } }) {
  return <SuccessPage grToken={searchParams?.gr} />;
}
