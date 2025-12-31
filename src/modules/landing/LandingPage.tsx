'use client';

import { Dua } from '@/components/Dua';

import { PageContainer } from '@/theme/Page';

import { LandingBackground } from './Background';
import { LandingBranches } from './Branches';
import Footer from './Footer';
import { Intro } from './Intro';
import { LinkArea } from './LinkArea/LinkArea';

export function LandingPage() {
  return (
    <PageContainer hideHeader>
      <LandingBackground />
      <Dua contentId="title" />
      <Intro />
      <LinkArea />
      <LandingBranches />
      <Footer />
    </PageContainer>
  );
}
