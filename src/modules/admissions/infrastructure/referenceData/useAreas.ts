'use client';

import { useAreaControllerFindAll } from '@/providers/service/area/area';

export function useAreas(branchId: string | undefined) {
  return useAreaControllerFindAll(
    { includeInActive: false, take: 100, skip: 0, sortBy: 'name', sortOrder: 'asc', branchId },
    { query: { enabled: !!branchId } },
  );
}
