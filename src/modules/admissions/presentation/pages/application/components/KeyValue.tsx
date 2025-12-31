'use client';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { Box } from '@mui/material';

import { Typography } from '@/theme/Typography';

export function KeyValue({
  labelMessage,
  value,
  valueDir = 'ltr',
  placeholder = '—',
}: {
  labelMessage: MessageDescriptor;
  value?: string | number | null;
  valueDir?: 'ltr' | 'rtl';
  placeholder?: string;
}) {
  const intl = useIntl();

  const text = value === undefined || value === null || String(value).trim() === '' ? placeholder : String(value);

  return (
    <Box
      sx={{
        direction: 'rtl',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' },
        gap: 1,
        alignItems: 'baseline',
        py: 0.5,
      }}
    >
      <Typography language="ur" variant="body2" color="text.secondary" sx={{ textAlign: 'right', fontWeight: 600 }}>
        {intl.formatMessage(labelMessage)}
      </Typography>
      <Typography
        language={valueDir === 'rtl' ? 'ur' : 'en'}
        variant="body1"
        sx={{
          textAlign: valueDir === 'rtl' ? 'right' : 'left',
          direction: valueDir,
          fontWeight: 600,
          px: 1,
          py: 0.75,
          borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.55)',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
