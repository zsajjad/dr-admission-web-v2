import { Metadata } from 'next';
import { Suspense } from 'react';

import { ApplicationFormPage } from '@/modules/admissions/presentation/pages/application/ApplicationFormPage';

export const metadata: Metadata = {
  title: 'داخلہ برائے سال ۱۴۴۷ھ',
  description: 'داخلہ برائے سال ۱۴۴۷ھ',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ApplicationFormPage />
    </Suspense>
  );
}
