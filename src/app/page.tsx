import { Metadata } from 'next';

import { config } from '@/config';

import { LandingPage } from '@/modules/landing';

export const metadata: Metadata = {
  title: config.site.name,
};

export default function Landing() {
  return <LandingPage />;
}
