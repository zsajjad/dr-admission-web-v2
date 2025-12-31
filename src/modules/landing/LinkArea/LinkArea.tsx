'use client';

import { useState } from 'react';

import { Box, Button, Container } from '@mui/material';

import { LinkAreaTitle } from './LinkAreaTitle';
import { styles } from './styles';
import Link from 'next/link';
import { FormattedMessage } from '@/theme/FormattedMessage';
import messages from '../messages';

export function LinkArea() {
  return (
    <Box sx={styles.wrapper}>
      <Container maxWidth="md" sx={styles.container}>
        <LinkAreaTitle />
        <Button
          component={Link}
          href="/admissions/application"
          variant="outlined"
          size="large"
          sx={styles.actionButton}
        >
          <FormattedMessage message={messages.newAdmission} language="ur" sx={styles.actionMessage} />
        </Button>
        <Button
          component={Link}
          href="/admissions/legacy/scan-qr"
          variant="outlined"
          size="large"
          sx={styles.actionButton}
        >
          <FormattedMessage message={messages.legacyScanQr} language="ur" sx={styles.actionMessage} />
        </Button>
        <Button
          component={Link}
          href="/admissions/legacy/phone"
          variant="outlined"
          size="large"
          sx={styles.actionButton}
        >
          <FormattedMessage message={messages.legacySearchByPhone} language="ur" sx={styles.actionMessage} />
        </Button>
      </Container>
    </Box>
  );
}
