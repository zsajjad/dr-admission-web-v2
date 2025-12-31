export type AgeCategory = 'tiflan' | 'muhibaan' | 'nasiraan' | 'unknown';

export const BRANCH_LOGOS: Record<AgeCategory, string | null> = {
  tiflan: '/tiflan.svg',
  muhibaan: '/muhibaan.svg',
  nasiraan: '/nasiran.svg',
  unknown: null,
};

export function getBranchFromClassLevel(classLevelName?: string, classLevelCode?: string): AgeCategory {
  const nameOrCode = (classLevelName || classLevelCode || '').toLowerCase();

  if (nameOrCode.includes('tiflan') || nameOrCode.includes('طفلان')) return 'tiflan';
  if (nameOrCode.includes('nasir') || nameOrCode.includes('ناصران')) return 'nasiraan';
  if (nameOrCode.includes('muhib') || nameOrCode.includes('محب')) return 'muhibaan';

  return 'unknown';
}

export function getAgeCategory(age: number): AgeCategory {
  if (age >= 6 && age <= 9) return 'tiflan';
  if (age >= 10 && age <= 17) return 'muhibaan';
  return 'unknown';
}
