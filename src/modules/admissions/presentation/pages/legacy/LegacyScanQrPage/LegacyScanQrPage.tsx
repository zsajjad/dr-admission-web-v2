'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Container, debounce } from '@mui/material';

import QRReader from '@/components/QRReader';

import { useAdmissionsControllerSearchLegacy } from '@/providers/service/admissions/admissions';

import { useFormattedMessage } from '@/theme/FormattedMessage';
import { PageContainer } from '@/theme/Page';

import { encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';

import messages from './messages';

export function LegacyScanQrPage() {
  const router = useRouter();
  const title = useFormattedMessage(messages.title);
  const subtitle = useFormattedMessage(messages.subtitle);
  const [qrContent, setQrContent] = useState<string | null>(null);

  const handleQrContent = useCallback((qrContent: string) => {
    if (!qrContent) return false;
    if (typeof qrContent !== 'string') return false;

    // Check if QR Code is a GR Number starting with 9221-[GENDER]-[AREA_CODE]-[COUNTER]
    if (!qrContent.startsWith('9221-')) return false;
    setQrContent(qrContent);
    return true;
  }, []);

  const { refetch, ...admissionSearchQuery } = useAdmissionsControllerSearchLegacy(
    { query: qrContent ?? '' },
    { query: { enabled: false } },
  );

  const refetchAdmissions = useCallback(() => {
    refetch();
  }, [refetch]);

  const debouncedAdmissionsFetch = useRef(debounce(refetchAdmissions, 500));

  useEffect(() => {
    if (qrContent) {
      debouncedAdmissionsFetch.current();
    }
  }, [qrContent, refetchAdmissions]);

  const firstItem = admissionSearchQuery.data?.data?.[0];

  useEffect(() => {
    if (!qrContent) return;
    if (!firstItem) return;
    if (firstItem.grNumber !== qrContent) return;

    const token = encodeLegacyLookupToken(qrContent);
    router.push(`/admissions/application?legacy=${encodeURIComponent(token)}`);
    setQrContent(null);
  }, [firstItem, qrContent, router]);

  return (
    <PageContainer pageTitle={{ title: { text: title, language: 'ur' }, subtitle: { text: subtitle, language: 'ur' } }}>
      <Container maxWidth="md">
        <Box sx={{ backgroundColor: 'secondary.light', borderRadius: 2, width: '100%', p: 2, height: 400 }}>
          <QRReader onComplete={handleQrContent} isLoading={admissionSearchQuery.isFetching} />
        </Box>
      </Container>
    </PageContainer>
  );
}
