/**
 * Soft Pastel Glow animated background (text-safe, dashboard-friendly)
 * - Light base wash
 * - Subtle pastel glow "blobs"
 * - Ultra-light noise overlay
 * - Respects prefers-reduced-motion
 */

import { Box, BoxProps } from '@mui/material';
import { orange } from '@mui/material/colors';

const noiseDataUrl =
  // Small inline SVG noise (soft-light blended)
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")";

export function GradientBackdrop(props: BoxProps) {
  const { sx, ...rest } = props;

  return (
    <Box
      aria-hidden
      {...rest}
      sx={[
        {
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
          bgcolor: orange[200],

          // Tunables (can be overridden by passing sx with these CSS vars)
          '--blur': '90px',
          '--opacity': '0.45',
          '--speed': '22s',

          // Keyframes defined as plain CSS for maximum SSR-friendliness
          '@keyframes spg-drift1': {
            from: { transform: 'translate3d(0,0,0) scale(1)' },
            to: { transform: 'translate3d(18vw,10vh,0) scale(1.06)' },
          },
          '@keyframes spg-drift2': {
            from: { transform: 'translate3d(0,0,0) scale(1.02)' },
            to: { transform: 'translate3d(-16vw,14vh,0) scale(1.08)' },
          },
          '@keyframes spg-drift3': {
            from: { transform: 'translate3d(0,0,0) scale(1.04)' },
            to: { transform: 'translate3d(10vw,-18vh,0) scale(1.1)' },
          },

          // Base light wash
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(1200px 900px at 20% 10%, rgba(210,220,255,0.35), transparent 55%),' +
              'radial-gradient(900px 700px at 85% 30%, rgba(255,220,235,0.35), transparent 60%),' +
              'linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,1))',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {/* Pastel blobs */}
      <Box
        sx={{
          position: 'absolute',
          width: 'min(65vmax, 900px)',
          height: 'min(65vmax, 900px)',
          borderRadius: 9999,
          filter: 'blur(var(--blur))',
          opacity: 'var(--opacity)',
          willChange: 'transform',
          mixBlendMode: 'multiply',

          left: '-20%',
          top: '-25%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,200,230,0.9), transparent 60%),' +
            'radial-gradient(circle at 70% 70%, rgba(200,220,255,0.85), transparent 58%)',
          animation: 'spg-drift1 var(--speed) ease-in-out infinite alternate',

          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none !important',
          },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 'min(65vmax, 900px)',
          height: 'min(65vmax, 900px)',
          borderRadius: 9999,
          filter: 'blur(var(--blur))',
          opacity: 'var(--opacity)',
          willChange: 'transform',
          mixBlendMode: 'multiply',

          right: '-25%',
          top: '5%',
          background:
            'radial-gradient(circle at 35% 45%, rgba(200,245,230,0.9), transparent 60%),' +
            'radial-gradient(circle at 70% 35%, rgba(255,240,200,0.85), transparent 58%)',
          animation: 'spg-drift2 calc(var(--speed) * 1.15) ease-in-out infinite alternate',

          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none !important',
          },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 'min(65vmax, 900px)',
          height: 'min(65vmax, 900px)',
          borderRadius: 9999,
          filter: 'blur(var(--blur))',
          opacity: 'var(--opacity)',
          willChange: 'transform',
          mixBlendMode: 'multiply',

          left: '10%',
          bottom: '-35%',
          background:
            'radial-gradient(circle at 40% 35%, rgba(215,205,255,0.9), transparent 60%),' +
            'radial-gradient(circle at 70% 70%, rgba(255,215,200,0.85), transparent 58%)',
          animation: 'spg-drift3 calc(var(--speed) * 1.3) ease-in-out infinite alternate',

          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none !important',
          },
        }}
      />

      {/* Ultra-light noise */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          backgroundImage: noiseDataUrl,
          backgroundSize: '180px 180px',
          mixBlendMode: 'soft-light',
        }}
      />
    </Box>
  );
}
