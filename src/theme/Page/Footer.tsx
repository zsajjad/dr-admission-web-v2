/**
 * Page Footer component
 */

import { Container } from '@mui/material';

import { FormattedMessage } from '../FormattedMessage';

import messages from './messages';

export function PageFooter() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        width: 'calc(100% - 32px)',
        backgroundColor: 'divider',
        borderRadius: 2,
        px: { xs: 2, md: 2 },
        py: { xs: 1, md: 1 },
        color: 'primary.main',
        marginBottom: 2,
      }}
    >
      <FormattedMessage message={messages.footer} language="ur" values={{ year: new Date().getFullYear() }} />
      {/* <Box>
        <Link href="/privacy">
          <FormattedMessage message={messages.privacyPolicy} language="ur" />
        </Link>
        <Link href="/contact">
          <FormattedMessage message={messages.contact} language="ur" />
        </Link>
      </Box> */}
    </Container>
  );
}
