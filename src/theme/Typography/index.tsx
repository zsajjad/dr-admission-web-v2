'use client';

import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';

export type Language = 'en' | 'ur' | 'ar';

export interface TypographyProps extends MuiTypographyProps {
  language?: Language;
}

const getFontFamily = (language?: Language) => {
  switch (language) {
    case 'ur':
      return 'var(--font-mehr)';
    case 'ar':
      return 'var(--font-saleem)';
    case 'en':
      return 'var(--font-jakarta)';
    default:
      return undefined; // Inherit from theme/parent
  }
};

const getLineHeight = (language?: Language) => {
  switch (language) {
    case 'ur':
      return '2'; // Nastaliq usually needs more vertical space
    default:
      return undefined;
  }
};

export function Typography({ language, sx, ...props }: TypographyProps) {
  const fontFamily = getFontFamily(language);
  const lineHeight = getLineHeight(language);

  return (
    <MuiTypography
      sx={{
        fontFamily,
        lineHeight,
        ...sx,
      }}
      {...props}
    />
  );
}
