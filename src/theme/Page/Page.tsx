/**
 * Page container component for the admissions application
 */

import { Box } from '@mui/material';

import { GradientBackdrop } from '../Backdrop';

import { PageFooter } from './Footer';
import { PageHeader } from './Header';
import { PageTitleProps, Title } from './Title';

interface PageContainerProps {
  children: React.ReactNode;
  pageTitle?: PageTitleProps;
  hideHeader?: boolean;
}

export function PageContainer({ children, pageTitle, hideHeader = false }: PageContainerProps) {
  return (
    <Box
      sx={{
        py: { xs: 3, md: 5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <GradientBackdrop />
      {!hideHeader ? <PageHeader /> : null}
      {pageTitle ? <Title {...pageTitle} /> : null}
      <Box
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 500px)',
          position: 'relative',
          justifyContent: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
      <PageFooter />
    </Box>
  );
}
