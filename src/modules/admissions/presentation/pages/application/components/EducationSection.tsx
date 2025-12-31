'use client';

import { useMemo } from 'react';

import { Stack } from '@mui/material';

import { useFormikContext } from 'formik';

import type { AdmissionFormValues } from '../admissionFormSchema';
import messages from '../messages';

import { SectionCard } from './SectionCard';
import { SwitchField } from './SwitchField';
import { TextField } from './TextField';

function parseDateOnlyUtc(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Validate that the date didn't roll over (e.g., 2025-02-31)
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return date;
}

function getAgeYears(dobIsoDateOnly: string): number | null {
  if (!dobIsoDateOnly) return null;
  const dob = parseDateOnlyUtc(dobIsoDateOnly);
  if (!dob) return null;

  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  let age = todayUtc.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = todayUtc.getUTCMonth() - dob.getUTCMonth();
  const dayDiff = todayUtc.getUTCDate() - dob.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age;
}

export function EducationSection() {
  const { values } = useFormikContext<AdmissionFormValues>();

  const ageYears = useMemo(() => getAgeYears(values.dateOfBirth), [values.dateOfBirth]);
  const showAdultFlags = typeof ageYears === 'number' && ageYears > 17;

  return (
    <SectionCard titleMessage={messages.sectionEducation} descriptionMessage={messages.sectionEducationDesc}>
      <Stack spacing={1}>
        <TextField name="schoolName" labelMessage={messages.labelSchool} inputDir="ltr" />
        <TextField name="schoolClass" labelMessage={messages.labelSchoolClass} inputDir="ltr" />

        {showAdultFlags ? (
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <SwitchField name="isWorking" labelMessage={messages.labelIsWorking} />
            <SwitchField name="isMarried" labelMessage={messages.labelIsMarried} />
          </Stack>
        ) : null}
      </Stack>
    </SectionCard>
  );
}
