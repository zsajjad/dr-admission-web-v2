'use client';

import { config } from '@/config';
import type { AdmissionFormValues } from '@/modules/admissions/presentation/pages/application/admissionFormSchema';

import { useCreateAdmission } from './useCreateAdmission';

export function useSubmitAdmissionApplication() {
  const createAdmission = useCreateAdmission();
  const sessionId = config.ADMISSIONS_ACTIVE_SESSION_ID;

  const submit = async (values: AdmissionFormValues, opts?: { legacyStudentId?: string }) => {
    if (!sessionId) {
      throw new Error('MISSING_ACTIVE_SESSION_ID');
    }

    return await createAdmission.mutateAsync({
      data: {
        sessionId,
        legacyStudentId: opts?.legacyStudentId,
        branchId: values.branchId,
        areaId: values.areaId,
        name: values.name.trim(),
        fatherName: values.fatherName.trim(),
        dateOfBirth: values.dateOfBirth,
        gender: values.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
        phone: values.phone.trim(),
        alternatePhone: values.alternatePhone.trim() || undefined,
        address: [values.addressLine.trim(), values.localityOrCity.trim()].filter(Boolean).join('\n') || undefined,
        identityNumber: values.identityNumber.trim() || undefined,
        schoolName: values.schoolName.trim() || undefined,
        lastYearClass: values.lastYearClass.trim() || undefined,
        vanRequired: values.vanRequired ?? undefined,
      },
    });
  };

  return {
    submit,
    mutation: createAdmission,
    missingSessionId: !sessionId,
  };
}
