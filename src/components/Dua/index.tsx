/**
 * Component renders excerpts of dua from Content in this directory.
 * Arabic verse and urdu translation are rendered side by side.
 *
 * In our theme color i.e Dark Purple for year 2026
 */

import { Container } from '@mui/material';

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
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'background.default',
        borderRadius: 2,
        backdropFilter: 'blur(40px)',
        mx: 2,
        p: 2,
        textAlign: 'center',
      }}
    >
      <Typography language="ar" variant="body1" color="primary.dark" fontSize={24}>
        {content.arabic}
      </Typography>
      <Typography language="ur" variant="body1" color="primary.dark">
        {content.translation}
      </Typography>
    </Container>
  );
}
