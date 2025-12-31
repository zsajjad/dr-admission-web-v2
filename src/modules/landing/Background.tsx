import { Box } from '@mui/material';

import { Animation } from '@/theme/Animation';

import LightRay from './LightRay';

export function LandingBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          width: '100vw',
          mixBlendMode: 'plus-lighter',
          opacity: 0.7,
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <LightRay />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          mixBlendMode: 'difference',
          opacity: 0.3,
          maxHeight: '80vh',
          width: '100vw',
        }}
      >
        <Animation title="top" loop autoplay />
        <Animation title="top" loop autoplay />
      </Box>
    </Box>
  );
}
