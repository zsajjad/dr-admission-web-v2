import { Box, Button } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from '../messages';
import { styles } from './styles';

export function LegacyContent(props: { onBack: () => void }) {
  return (
    <Box sx={styles.actions}>
      <Button variant="text" size="large" onClick={props.onBack} sx={{ mt: 1 }}>
        <FormattedMessage message={messages.back} language="ur" sx={{ color: 'primary.dark' }} />
      </Button>
    </Box>
  );
}
