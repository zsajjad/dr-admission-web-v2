'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, Container, Stack } from '@mui/material';

import { useAdmissionsControllerFindAll } from '@/providers/service/admissions/admissions';

import { FormattedMessage, useFormattedMessage } from '@/theme/FormattedMessage';
import { PageContainer } from '@/theme/Page';
import { SectionCard } from '@/theme/SectionCard';
import { Typography } from '@/theme/Typography';

import { decodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';

import { ContactSection } from './ContactSection';
import { GrNumberCard } from './GrNumberCard';
import messages from './messages';
import { RulesDisplay } from './RulesDisplay';
import { getBranchFromClassLevel } from './utils';

export function SuccessPage({ grToken }: { grToken?: string }) {
  const title = useFormattedMessage<string>(messages.title);
  const subtitle = useFormattedMessage<string>(messages.subtitle);
  const grNumberLabel = useFormattedMessage<string>(messages.grNumberLabel);

  const decoded = grToken ? decodeLegacyLookupToken(grToken) : null;
  const grNumber = decoded?.query?.trim() || '';

  const { data: admissionData, isLoading } = useAdmissionsControllerFindAll(
    { grNumber },
    { query: { enabled: !!grNumber } },
  );

  const admission = admissionData?.data?.[0];
  const age = admission?.classLevel?.age;
  const gender = admission?.student?.gender;
  const classLevelName = admission?.classLevel?.name;
  const classLevelCode = admission?.classLevel?.code;

  const branch = getBranchFromClassLevel(classLevelName, classLevelCode);

  return (
    <PageContainer pageTitle={{ title: { text: title, language: 'ur' }, subtitle: { text: subtitle, language: 'ur' } }}>
      <Container maxWidth="md">
        <Stack spacing={2}>
          <GrNumberCard grNumber={grNumber} grNumberLabel={grNumberLabel} branch={branch} />

          <SectionCard titleMessage={messages.rulesTitle} showDivider={false}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : age !== undefined && gender ? (
              <RulesDisplay age={age} gender={gender} grNumber={grNumber} />
            ) : (
              <Typography language="ur" variant="body1" sx={{ textAlign: 'right' }}>
                <FormattedMessage message={messages.rulesNotAvailable} language="ur" />
              </Typography>
            )}
          </SectionCard>

          <ContactSection />

          {/* Next Admission Button */}
          <Button
            href="/admissions"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            fullWidth
            sx={{ py: 1.5 }}
          >
            <FormattedMessage message={messages.nextAdmission} language="ur" sx={{ fontSize: 22 }} />
          </Button>
        </Stack>
      </Container>
    </PageContainer>
  );
}
