'use client';

import type { PropsWithChildren, ReactNode } from 'react';

import type { MessageDescriptor, PrimitiveType } from 'react-intl';

import { Box, Divider } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

export interface SectionCardProps {
  titleMessage?: MessageDescriptor;
  descriptionMessage?: MessageDescriptor;
  descriptionValues?: Record<string, ReactNode | PrimitiveType>;
  /** Show divider after title/description. Defaults to true when title or description is present */
  showDivider?: boolean;
}

export function SectionCard({
  titleMessage,
  descriptionMessage,
  descriptionValues,
  showDivider,
  children,
}: PropsWithChildren<SectionCardProps>) {
  const hasHeader = titleMessage || descriptionMessage;
  const shouldShowDivider = showDivider ?? hasHeader;

  return (
    <Box sx={{ backgroundColor: 'secondary.light', borderRadius: 2, width: '100%', p: 2, direction: 'rtl' }}>
      {titleMessage ? (
        <FormattedMessage
          message={titleMessage}
          language="ur"
          variant="h5"
          sx={{ fontWeight: 700, textAlign: 'right', color: 'primary.dark' }}
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
      {shouldShowDivider ? <Divider sx={{ my: 2 }} /> : null}
      {children}
    </Box>
  );
}
