'use client';

import { useBranchControllerFindAll } from '@/providers/service/branch/branch';

export function useBranches() {
  return useBranchControllerFindAll({ take: 100, skip: 0, sortBy: 'name', sortOrder: 'asc' });
}
