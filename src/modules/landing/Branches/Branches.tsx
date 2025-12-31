import Image from 'next/image';

import { Box } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from '../messages';

import { styles } from './styles';

export function LandingBranches() {
  return (
    <Box sx={styles.wrapper}>
      <FormattedMessage
        message={messages.branchesTitle}
        language="ur"
        variant="h2"
        color="primary.dark"
        sx={styles.title}
      />
      <FormattedMessage
        message={messages.branchesDescription}
        language="ur"
        variant="body1"
        color="primary.dark"
        sx={styles.description}
      />
      <Box sx={styles.branches}>
        <Box sx={{ ...styles.branch, backgroundColor: '#ffedd5' }}>
          <Image src="/tiflan.svg" alt="branches" width={140} height={140} />
          <FormattedMessage
            message={messages.tiflanTitle}
            language="ur"
            variant="h3"
            color="primary.dark"
            sx={styles.branchTitle}
          />
          <FormattedMessage
            message={messages.tiflanDescription}
            language="ur"
            variant="body1"
            color="primary.dark"
            sx={styles.branchDescription}
          />
        </Box>
        <Box sx={{ ...styles.branch, backgroundColor: '#e0f2fe' }}>
          <Image src="/muhibaan.svg" alt="branches" width={140} height={140} />
          <FormattedMessage
            message={messages.muhibaanTitle}
            language="ur"
            variant="h3"
            color="primary.dark"
            sx={styles.branchTitle}
          />
          <FormattedMessage
            message={messages.muhibaanDescription}
            language="ur"
            variant="body1"
            color="primary.dark"
            sx={styles.branchDescription}
          />
        </Box>
        <Box sx={{ ...styles.branch, backgroundColor: '#dcfce7' }}>
          <Image src="/nasiran.svg" alt="branches" width={140} height={140} />
          <FormattedMessage
            message={messages.nasiranTitle}
            language="ur"
            variant="h3"
            color="primary.dark"
            sx={styles.branchTitle}
          />
          <FormattedMessage
            message={messages.nasiranDescription}
            language="ur"
            variant="body1"
            color="primary.dark"
            sx={styles.branchDescription}
          />
        </Box>
      </Box>
    </Box>
  );
}
