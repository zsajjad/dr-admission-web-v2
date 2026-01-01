/**
 * Component renders excerpts of dua from Content in this directory.
 * Arabic verse and urdu translation are rendered side by side.
 *
 * In our theme color i.e Dark Purple for year 2026
 */
import Image from 'next/image';

import { Box, Container } from '@mui/material';

import { Typography } from '@/theme/Typography';

import { dua } from './content';

interface DuaProps {
  contentId: keyof typeof dua;
}

export function Dua({ contentId }: DuaProps) {
  const content = dua[contentId];
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'start',
        gap: 1,
        backgroundColor: 'background.default',
        borderRadius: 2,
        backdropFilter: 'blur(40px)',
        mx: 2,
        p: 2,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '& img': {
            filter: 'brightness(0) saturate(100%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'primary.dark',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          },
        }}
      >
        <Image src="/bismillah.png" alt="bismillah" width={50} height={72} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography language="ar" variant="body1" color="primary.dark" fontSize={24}>
          {content.arabic}
        </Typography>
        <Typography language="ur" variant="body1" color="primary.dark">
          {content.translation}
        </Typography>
      </Box>
    </Container>
  );
}
