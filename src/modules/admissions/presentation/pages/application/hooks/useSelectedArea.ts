'use client';

import { useMemo } from 'react';

import { useAreaControllerFindAll } from '@/providers/service/area/area';

export function useSelectedArea(branchId: string | undefined, areaId: string | undefined) {
  const areasQuery = useAreaControllerFindAll(
    branchId ? { branchId, take: 100, sortBy: 'name', sortOrder: 'asc', includeInActive: false } : undefined,
    { query: { enabled: !!branchId, staleTime: 5 * 60 * 1000 } },
  );

  const selectedArea = useMemo(() => {
    const list = areasQuery.data?.data ?? [];
    return areaId ? list.find((a) => a.id === areaId) : undefined;
  }, [areasQuery.data?.data, areaId]);

  return { areasQuery, selectedArea };
}

export function useAreaHasVan(
  branchId: string | undefined,
  areaId: string | undefined,
): {
  MALE: boolean;
  FEMALE: boolean;
} {
  const { selectedArea } = useSelectedArea(branchId, areaId);
  return {
    MALE: !!selectedArea?.hasBoysVan,
    FEMALE: !!selectedArea?.hasVan,
  };
}
