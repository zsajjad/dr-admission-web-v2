import { Container, Box } from '@mui/material';

import { Typography } from '../Typography';

export interface PageTitleProps {
  title: {
    text: string | React.ReactNode;
    language: 'en' | 'ur';
  };
  subtitle: {
    text: string | React.ReactNode;
    language?: 'en' | 'ur';
  };
}

export function Title({ title, subtitle }: PageTitleProps) {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'right', mt: { xs: 1, md: 6 }, mb: 2 }}>
      <Box sx={{ position: 'relative', display: 'inline-block', mx: 3 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, position: 'relative', zIndex: 1, px: 2 }}
          language="ur"
          color="primary.dark"
        >
          {title.text}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: -12,
            right: 0,
            height: 18,
            bgcolor: 'secondary.main',
            borderRadius: 8,
            zIndex: 0,
            width: 'calc(100% + 24px)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: -12,
              top: 4,
              transform: 'translateY(-50%)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '4px solid',
              borderColor: 'primary.dark',
              backgroundColor: 'secondary.main',
            }}
          />
        </Box>
      </Box>
      {subtitle ? (
        <Typography
          variant="body1"
          color="primary.dark"
          sx={{ mt: 1, fontWeight: 500, fontSize: 22, px: 3 }}
          language={subtitle.language}
        >
          {subtitle.text}
        </Typography>
      ) : null}
    </Container>
  );
}
