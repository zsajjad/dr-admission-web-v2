import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from '../messages';
import { styles } from './styles';

export function LinkAreaTitle() {
  return (
    <FormattedMessage
      message={messages.admissionTitle}
      language="ur"
      variant="h2"
      color="primary.dark"
      sx={styles.title}
    />
  );
}
