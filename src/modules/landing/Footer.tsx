'use client';

import { Box } from '@mui/material';
import { Typography } from '@/theme/Typography';
import messages from './messages';
import { useFormattedMessage } from '@/theme/FormattedMessage';

export default function HomeClosing() {
  const message = useFormattedMessage(messages.closingQuote);
  const author = useFormattedMessage(messages.closingQuoteAuthor);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'center',
          pt: 1, // For Text Alignment
          mx: 'auto',
          px: 4,
        }}
        maxWidth={'md'}
      >
        <Typography language="ur" variant="body1" sx={{ lineHeight: 2, fontSize: 24 }} color="primary.main">
          {message}
        </Typography>
        <Typography language="ar" variant="body1" sx={{ fontSize: 28, fontWeight: 500 }} color="primary.main">
          {author}
        </Typography>
      </Box>
      <Box
        sx={{
          bottom: 0,
          left: 0,
          width: '100%',
          height: { xs: '50vh', md: '80vh' },
          zIndex: 0,
          backgroundImage: `url('/forward.webp')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          backgroundSize: { xs: '200%', md: 'contain' },
          willChange: 'transform',
        }}
      />
    </Box>
  );
}
