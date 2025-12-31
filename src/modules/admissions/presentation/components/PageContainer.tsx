'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import { Box, Container, Typography } from '@mui/material';

export function PageContainer({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle?: ReactNode }>) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Container>
  );
}
