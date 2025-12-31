'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import type { MessageDescriptor, PrimitiveType } from 'react-intl';

import { Box, Divider } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

export function SectionCard({
  titleMessage,
  descriptionMessage,
  descriptionValues,
  children,
}: PropsWithChildren<{
  titleMessage?: MessageDescriptor;
  descriptionMessage?: MessageDescriptor;
  descriptionValues?: Record<string, ReactNode | PrimitiveType>;
}>) {
  return (
    <Box sx={{ backgroundColor: 'secondary.light', borderRadius: 2, width: '100%', p: 2 }}>
      {titleMessage ? (
        <FormattedMessage
          message={titleMessage}
          language="ur"
          variant="h5"
          sx={{ fontWeight: 700, textAlign: 'right' }}
        />
      ) : null}
      {descriptionMessage ? (
        <FormattedMessage
          message={descriptionMessage}
          values={descriptionValues}
          language="ur"
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'right', mt: 0, fontSize: 16 }}
        />
      ) : null}
      {titleMessage || descriptionMessage ? <Divider sx={{ my: 2 }} /> : null}
      {children}
    </Box>
  );
}
