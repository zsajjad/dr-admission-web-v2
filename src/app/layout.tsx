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
  applicationName: config.site.name,
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
      <head>
        {/* Keep favicon links directly in <head> for non-JS checkers/bots */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="application-name" content={config.site.name} />
        <meta name="apple-mobile-web-app-title" content={config.site.name} />
      </head>
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
