import { defineMessages } from 'react-intl';

const domain = 'app.admissions.components.studentListItem';

const messages = defineMessages({
  name: {
    id: `${domain}.name`,
    defaultMessage: '{name} {relationPart}',
  },
  gender: {
    id: `${domain}.gender`,
    defaultMessage: '{gender}',
  },
  grNumber: {
    id: `${domain}.grNumber`,
    defaultMessage: '{grNumber}',
  },
});

export default messages;
