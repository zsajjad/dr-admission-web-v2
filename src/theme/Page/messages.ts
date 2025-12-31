import { defineMessages } from 'react-intl';

const domain = 'app.page';

const messages = defineMessages({
  footer: {
    id: `${domain}.footer`,
    defaultMessage: '© {year} دانشگاہ رمضان',
  },
  privacyPolicy: {
    id: `${domain}.privacyPolicy`,
    defaultMessage: 'Privacy Policy',
  },
  contact: {
    id: `${domain}.contact`,
    defaultMessage: 'Contact',
  },
  admission: {
    id: `${domain}.admission`,
    defaultMessage: 'داخلہ برائے سال ۱۴۴۷ھ',
  },
});

export default messages;
