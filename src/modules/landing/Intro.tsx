import Image from 'next/image';

import { Container } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';

export function Intro() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        margin: 8,
      }}
    >
      <Image src="/thumb.svg" width={220} height={220} alt={'logo'} />
      <FormattedMessage
        message={messages.landingDescription}
        language="ur"
        variant="body1"
        color="primary.dark"
        sx={{ textAlign: 'center', fontSize: '1.5rem', paddingLeft: 4, paddingRight: 4 }}
      />
    </Container>
  );
}
