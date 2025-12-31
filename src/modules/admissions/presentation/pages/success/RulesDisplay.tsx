'use client';

import { Box, Divider, Stack } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';
import { ReminderButton } from './ReminderButton';
import { getAgeCategory } from './utils';

export interface RulesDisplayProps {
  age: number;
  gender: 'MALE' | 'FEMALE';
  grNumber: string;
}

export function RulesDisplay({ age, gender, grNumber }: RulesDisplayProps) {
  const ageCategory = getAgeCategory(age);
  const isMale = gender === 'MALE';

  if (ageCategory === 'tiflan') {
    return (
      <Box sx={{ textAlign: 'right' }}>
        <FormattedMessage message={messages.tiflanTitle} language="ur" variant="h6" sx={{ fontWeight: 700, mb: 2 }} />
        <Stack spacing={1} sx={{ textAlign: 'right' }}>
          <FormattedMessage message={messages.tiflanFeeDate} language="ur" />
          <FormattedMessage message={messages.tiflanFeeTime} language="ur" />
          <FormattedMessage message={messages.fees} language="ur" />
          <FormattedMessage message={messages.tiflanGuardianRule} language="ur" />
          <FormattedMessage message={messages.tiflanDeadline} language="ur" />
          <FormattedMessage message={messages.firstComeFirstServe} language="ur" />
          <FormattedMessage message={messages.seatsFilled} language="ur" />
        </Stack>

        <ReminderButton age={age} gender={gender} grNumber={grNumber} />
      </Box>
    );
  }

  if (ageCategory === 'muhibaan' || ageCategory === 'unknown') {
    return (
      <Box sx={{ textAlign: 'right', color: 'primary.dark' }}>
        <FormattedMessage message={messages.muhibaanTitle} language="ur" variant="h6" sx={{ fontWeight: 700, mb: 2 }} />
        <FormattedMessage
          message={isMale ? messages.forBoys : messages.forGirls}
          language="ur"
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 1 }}
        />

        <Stack spacing={1} sx={{ textAlign: 'right', mb: 2 }}>
          <FormattedMessage message={isMale ? messages.muhibaanBoysDay : messages.muhibaanGirlsDay} language="ur" />
          <FormattedMessage message={isMale ? messages.muhibaanBoysDate : messages.muhibaanGirlsDate} language="ur" />
          <FormattedMessage message={messages.muhibaanTime} language="ur" />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <FormattedMessage
          message={messages.commonRules}
          language="ur"
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 1 }}
        />

        <Stack spacing={1} sx={{ textAlign: 'right' }}>
          <FormattedMessage message={messages.fees} language="ur" />
          <FormattedMessage message={messages.muhibaanStudentRule} language="ur" />
          <FormattedMessage message={messages.muhibaanCardDeadline} language="ur" />
          <FormattedMessage message={messages.cardFirstComeFirstServe} language="ur" />
          <FormattedMessage message={messages.classSeatsFilled} language="ur" />
        </Stack>

        <ReminderButton age={age} gender={gender} grNumber={grNumber} />
      </Box>
    );
  }

  return null;
}
