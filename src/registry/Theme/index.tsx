'use client';

import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';

import { useLocale } from '@/contexts/LocaleContext';
import { createTheme } from '@/theme/MuiConfigs/create-theme';

import { EmotionCacheProvider } from './_emotion_cache';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function CustomThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const { locale } = useLocale();
  const theme = React.useMemo(() => createTheme(locale), [locale]);

  return (
    <EmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider disableTransitionOnChange theme={theme} defaultMode="light">
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              '--MainNav-height': '56px',
              '--MainNav-zIndex': 1000,
              '--SideNav-width': '280px',
              '--SideNav-zIndex': 1100,
              '--MobileNav-width': '270px',
              '--MobileNav-zIndex': 1100,
            },
          }}
        />
        {children}
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
