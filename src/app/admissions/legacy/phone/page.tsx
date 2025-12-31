import { Metadata } from 'next';

import { LegacyPhoneSearchPage } from '@/modules/admissions/presentation/pages/legacy/LegacyPhoneSearchPage';

export const metadata: Metadata = {
  title: 'Search by Phone',
  description: 'Search by phone number to find matching students.',
};

export default function Page() {
  return <LegacyPhoneSearchPage />;
}
