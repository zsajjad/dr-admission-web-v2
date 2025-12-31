import type { Metadata, Viewport } from 'next';

import { Plus_Jakarta_Sans } from 'next/font/google';
import localFont from 'next/font/local';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';

import { IntlRegistry } from '@/registry/Intl';
import { ReactQueryRegistry } from '@/registry/ReactQuery';
import { CustomThemeProvider } from '@/registry/Theme';

import { LocaleProvider } from '@/contexts/LocaleContext';

import { config } from '@/config';

export const metadata: Metadata = {
  title: {
    template: `%s | ${config.site.name}`,
    default: config.site.name,
  },
  description: config.site.description,
};

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const saleem = localFont({
  src: '../assets/fonts/PDMS_Saleem_QuranFont-signed.woff2',
  variable: '--font-saleem',
  display: 'swap',
});

const mehrNastaliq = localFont({
  src: '../assets/fonts/MehrNastaliq.woff2',
  variable: '--font-mehr',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${saleem.variable} ${mehrNastaliq.variable}`}>
      <head></head>
      <body>
        <ErrorBoundaryWrapper>
          <LocaleProvider>
            <AppRouterCacheProvider>
              <ReactQueryRegistry>
                <CustomThemeProvider>
                  <IntlRegistry>{children}</IntlRegistry>
                </CustomThemeProvider>
              </ReactQueryRegistry>
            </AppRouterCacheProvider>
          </LocaleProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
