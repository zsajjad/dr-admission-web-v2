'use client';

import { PageContainer } from '@/theme/Page';

import { Dua } from '@/components/Dua';

import Footer from './Footer';
import { Intro } from './Intro';
import { LinkArea } from './LinkArea/LinkArea';
import { LandingBackground } from './Background';
import { LandingBranches } from './Branches';

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
