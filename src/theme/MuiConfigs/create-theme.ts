'use client';

import { createTheme as muiCreateTheme } from '@mui/material/styles';

export function createTheme(locale: 'en' | 'ur' = 'en') {
  return muiCreateTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#3B22A8', // Deep purple (slightly lighter than before)
        light: '#6A44C4',
        dark: '#24106F',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#F7C6B5', // Pale Peach
        light: '#FBE0D7',
        dark: '#EFA991',
        contrastText: '#311B92',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
      },
      background: {
        default: '#F5F3F7', // Pale white with very subtle purple tint
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily:
        locale === 'ur'
          ? 'var(--font-mehr), var(--font-saleem), var(--font-jakarta), "Roboto", "Helvetica", "Arial", sans-serif'
          : 'var(--font-jakarta), var(--font-saleem), var(--font-mehr), "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });
}
