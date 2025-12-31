import { Box, Button } from '@mui/material';
import Link from 'next/link';

import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from '../messages';
import { styles } from './styles';

export function LinkAreaActions(props: { onLegacyClick: () => void }) {
  return (
    <Box sx={styles.actions}>
      <Button component={Link} href="/admissions/application" variant="outlined" size="large" sx={styles.actionButton}>
        <FormattedMessage message={messages.newAdmission} language="ur" sx={styles.actionMessage} />
      </Button>

      <Button variant="outlined" size="large" sx={styles.actionButton} onClick={props.onLegacyClick}>
        <FormattedMessage message={messages.legacyAdmission} language="ur" sx={styles.actionMessage} />
      </Button>
    </Box>
  );
}
