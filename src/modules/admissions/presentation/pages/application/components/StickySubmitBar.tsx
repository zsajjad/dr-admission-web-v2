'use client';

import type { MessageDescriptor } from 'react-intl';

import { Box, Button } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';
import { Typography } from '@/theme/Typography';

export function StickySubmitBar({
  submitMessage,
  hintMessage,
  disabled,
  onPress,
}: {
  submitMessage: MessageDescriptor;
  hintMessage: MessageDescriptor;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        pb: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        pt: 1.5,
      }}
    >
      <Box sx={{ maxWidth: 'md', mx: 'auto', px: 2, direction: 'rtl', display: 'grid', gap: 1 }}>
        <Button variant="contained" size="large" disabled={disabled} onClick={onPress} fullWidth>
          <FormattedMessage message={submitMessage} language="ur" />
        </Button>
        <Typography language="ur" variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          <FormattedMessage message={hintMessage} language="ur" />
        </Typography>
      </Box>
    </Box>
  );
}
