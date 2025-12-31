'use client';

import { useAdmissionsControllerCreate } from '@/providers/service/admissions/admissions';

export function useCreateAdmission() {
  return useAdmissionsControllerCreate();
}
