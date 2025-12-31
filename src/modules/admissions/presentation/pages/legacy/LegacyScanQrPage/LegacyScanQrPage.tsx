'use client';

import { Box, Container, debounce } from '@mui/material';

import { PageContainer } from '@/theme/Page';

import { useFormattedMessage } from '@/theme/FormattedMessage';
import { useAdmissionsControllerSearchLegacy } from '@/providers/service/admissions/admissions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LegacyStudentRow } from '@/providers/service/app.schemas';
import { encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';
import { useRouter } from 'next/navigation';
import messages from './messages';
import QRReader from '@/components/QRReader';

export function LegacyScanQrPage() {
  const router = useRouter();
  const title = useFormattedMessage(messages.title);
  const subtitle = useFormattedMessage(messages.subtitle);
  const [qrContent, setQrContent] = useState<string | null>(null);

  const handleQrContent = useCallback((qrContent: string) => {
    alert('handleQrContent ' + qrContent);
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
  }, []);

  const debouncedAdmissionsFetch = useRef(debounce(refetchAdmissions, 500));

  useEffect(() => {
    if (qrContent) {
      debouncedAdmissionsFetch.current();
    }
  }, [qrContent, refetchAdmissions]);

  useEffect(() => {
    if (!qrContent) return;
    alert('checking for matching record ' + qrContent + ' ' + admissionSearchQuery.data);
    const firstItem = admissionSearchQuery.data?.data?.[0];
    if (!firstItem) return;
    if (firstItem.grNumber !== qrContent) return;

    alert('Found matching record');
    const token = encodeLegacyLookupToken(qrContent);
    router.push(`/admissions/application?legacy=${encodeURIComponent(token)}`);
    setQrContent(null);
  }, [qrContent, router, admissionSearchQuery.data?.data]);

  const isLoading = useMemo<boolean>(() => {
    return admissionSearchQuery.isFetching;
  }, [admissionSearchQuery.isFetching]);

  return (
    <PageContainer pageTitle={{ title: { text: title, language: 'ur' }, subtitle: { text: subtitle, language: 'ur' } }}>
      <Container maxWidth="md">
        <Box sx={{ backgroundColor: 'secondary.light', borderRadius: 2, width: '100%', p: 2, height: 400 }}>
          <QRReader onComplete={handleQrContent} isLoading={isLoading} />
        </Box>
      </Container>
    </PageContainer>
  );
}
