'use client';

import Image from 'next/image';

import { Box } from '@mui/material';

import { Typography } from '@/theme/Typography';

import { AgeCategory, BRANCH_LOGOS } from './utils';

export interface GrNumberCardProps {
  grNumber: string;
  grNumberLabel: string;
  branch: AgeCategory;
}

export function GrNumberCard({ grNumber, grNumberLabel, branch }: GrNumberCardProps) {
  const branchLogo = BRANCH_LOGOS[branch];

  return (
    <Box sx={{ borderRadius: 2, width: '100%', direction: 'rtl', flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {branchLogo && (
          <Box
            sx={{
              flexShrink: 0,
              p: 1,
              backgroundColor: 'white',
              borderRadius: 2,
              width: 92,
              height: 92,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image src={branchLogo} alt={branch} width={80} height={60} />
          </Box>
        )}
        {grNumber ? (
          <Box
            sx={{
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.08)',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                language="ur"
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'right', fontWeight: 700 }}
              >
                {grNumberLabel}
              </Typography>
              <Typography language="en" variant="h6" sx={{ textAlign: 'right', fontWeight: 800, mt: 0.5 }}>
                {grNumber}
              </Typography>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
