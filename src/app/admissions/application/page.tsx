import { Suspense } from 'react';

import { ApplicationFormPage } from '@/modules/admissions/presentation/pages/application/ApplicationFormPage';

export default function Page() {
  // ApplicationFormPage uses `useSearchParams()` (client hook).
  // Next.js requires a Suspense boundary to avoid prerender bailout errors.
  return (
    <Suspense fallback={null}>
      <ApplicationFormPage />
    </Suspense>
  );
}
