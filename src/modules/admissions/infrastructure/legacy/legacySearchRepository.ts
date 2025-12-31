import { admissionsControllerSearchLegacy } from '@/providers/service/admissions/admissions';
import type { AdmissionsControllerSearchLegacyParams, LegacyStudentRow } from '@/providers/service/app.schemas';

export type LegacySearchResult = {
  count: number;
  data: LegacyStudentRow[];
};

export async function searchLegacyAdmissions(query: string): Promise<LegacySearchResult> {
  const params: AdmissionsControllerSearchLegacyParams = { query: query.trim() };
  return admissionsControllerSearchLegacy(params);
}
