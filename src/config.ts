import { getSiteURL } from '@/platform/Info/getSiteUrl';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string; id: string };
  logLevel: string;
  PUBLIC_API_DOMAIN: string;
  API_KEY: string;
  CAPTCHA_BYPASS: string;
  TURNSTILE_SITE_KEY: string;
  ADMISSIONS_ACTIVE_SESSION_ID: string;
}

export const config: Config = {
  site: {
    url: getSiteURL(),
    themeColor: '#090a0b',
    id: process.env.NEXT_PUBLIC_APP_ID ?? 'dr-admissions-web',
    description: 'Danishgah e Ramzan, Karachi, Pakistan',
    name: process.env.NEXTAPP_NAME ?? 'دانشگاہِ رمضان',
  },
  PUBLIC_API_DOMAIN: process.env.NEXT_PUBLIC_API_DOMAIN ?? 'https://localhost:4000',
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL ?? 'ALL',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY ?? '',
  CAPTCHA_BYPASS: process.env.NEXT_PUBLIC_CAPTCHA_BYPASS ?? 'false',
  TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
  ADMISSIONS_ACTIVE_SESSION_ID: process.env.NEXT_PUBLIC_ADMISSIONS_ACTIVE_SESSION_ID ?? '',
};
