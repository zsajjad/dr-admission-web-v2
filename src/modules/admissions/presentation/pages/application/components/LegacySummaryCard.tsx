'use client';

import { format } from 'date-fns';
import { startCase } from 'lodash';
import type { MessageDescriptor } from 'react-intl';

import { Box, Chip, Stack } from '@mui/material';

import { Typography } from '@/theme/Typography';

import { SectionCard } from './SectionCard';

type Gender = 'MALE' | 'FEMALE' | '' | string;

export type LegacySummaryPrefill = {
  grNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  lastYearClass?: string | null;
  branchId?: string | null;
  phone?: string | null;
  name?: string | null;
  fatherName?: string | null;
};

export function LegacySummaryCard({
  titleMessage,
  descriptionMessage,
  prefill,
}: {
  titleMessage: MessageDescriptor;
  descriptionMessage?: MessageDescriptor;
  prefill?: LegacySummaryPrefill | null;
}) {
  const fullName = [prefill?.name?.trim(), prefill?.fatherName?.trim()].filter(Boolean).join(' — ');

  const chips: Array<{ key: string; value: string; font: 'mehr' | 'jakarta' }> = [];

  if (prefill?.branchId?.trim()) {
    chips.push({ key: 'branch', value: startCase(prefill.branchId.trim()), font: 'jakarta' });
  }
  if (prefill?.dateOfBirth?.trim()) {
    chips.push({ key: 'dob', value: format(new Date(prefill.dateOfBirth.trim()), 'dd MMM yyyy'), font: 'jakarta' });
  }
  if (prefill?.grNumber?.trim()) {
    chips.push({ key: 'gr', value: prefill.grNumber.trim(), font: 'jakarta' });
  }
  if (prefill?.lastYearClass?.trim()) {
    chips.push({ key: 'lastYearClass', value: prefill.lastYearClass.trim(), font: 'jakarta' });
  }
  if (prefill?.gender?.trim()) {
    chips.push({ key: 'gender', value: prefill.gender.trim(), font: 'mehr' });
  }

  return (
    <SectionCard titleMessage={titleMessage} descriptionMessage={descriptionMessage}>
      <Stack spacing={1}>
        {/* Row 1: Chips */}
        {chips.length ? (
          <Box sx={{ direction: 'ltr', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {chips.map((c) => (
              <Chip
                key={c.key}
                label={c.value}
                color="secondary"
                size="small"
                sx={{
                  fontFamily: c.font === 'mehr' ? 'var(--font-mehr)' : 'var(--font-jakarta)',
                  bgcolor: 'rgba(255,255,255,0.55)',
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ height: 8 }} />
        )}

        {/* Row 2: Full name */}
        <Typography language="en" variant="h6" sx={{ fontWeight: 700, textAlign: 'left', mb: 0 }}>
          {fullName || '—'}
        </Typography>
        <Typography language="en" variant="body1" sx={{ fontWeight: 500, textAlign: 'left', mt: -2 }}>
          {prefill?.phone?.trim() ? prefill.phone.trim() : '—'}
        </Typography>
      </Stack>
    </SectionCard>
  );
}
