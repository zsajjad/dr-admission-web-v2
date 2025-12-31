/**
 * Page Header component
 */

import Link from 'next/link';

import { Box, Container } from '@mui/material';

import { FormattedMessage } from '../FormattedMessage';
import { Logo } from '../Logo';

import messages from './messages';

export function PageHeader() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        width: 'calc(100% - 32px)',
        backgroundColor: 'primary.dark',
        borderRadius: 2,
        px: { xs: 2, md: 2 },
        py: { xs: 1, md: 1 },
        color: 'primary.contrastText',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        marginBottom: 2,
      }}
    >
      <Link href="/">
        <Logo width={56} height={56} reverse={true} />
      </Link>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
      >
        <Link href="/admission" style={{ textDecoration: 'none' }}>
          <FormattedMessage
            message={messages.admission}
            language="ur"
            variant="body1"
            color="primary.contrastText"
            sx={{ fontWeight: 600, fontSize: 18, textDecoration: 'none' }}
          />
        </Link>
      </Box>
    </Container>
  );
}
