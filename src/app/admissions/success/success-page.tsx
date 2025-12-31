'use client';

import { Box, Container } from '@mui/material';

import { FormattedMessage, useFormattedMessage } from '@/theme/FormattedMessage';
import { PageContainer } from '@/theme/Page';
import { Typography } from '@/theme/Typography';

import { decodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';

import messages from './messages';

export function AdmissionSuccessPage({ grToken }: { grToken?: string }) {
  const title = useFormattedMessage<string>(messages.title);
  const subtitle = useFormattedMessage<string>(messages.subtitle);
  const grNumberLabel = useFormattedMessage<string>(messages.grNumberLabel);

  const decoded = grToken ? decodeLegacyLookupToken(grToken) : null;
  const grNumber = decoded?.query?.trim() || '';

  return (
    <PageContainer pageTitle={{ title: { text: title, language: 'ur' }, subtitle: { text: subtitle, language: 'ur' } }}>
      <Container maxWidth="md">
        <Box sx={{ backgroundColor: 'secondary.light', borderRadius: 2, width: '100%', p: 2, direction: 'rtl' }}>
          {grNumber ? (
            <Box
              sx={{
                mb: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.08)',
                p: 2,
              }}
            >
              <Typography
                language="ur"
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'right', fontWeight: 700 }}
              >
                {grNumberLabel}
              </Typography>
              <Typography language="en" variant="h6" sx={{ textAlign: 'right', fontWeight: 800, mt: 0.5 }}>
                {grNumber}
              </Typography>
            </Box>
          ) : null}
          <FormattedMessage message={messages.body} language="ur" sx={{ textAlign: 'right', fontSize: 18 }} />
        </Box>
      </Container>
    </PageContainer>
  );
}
