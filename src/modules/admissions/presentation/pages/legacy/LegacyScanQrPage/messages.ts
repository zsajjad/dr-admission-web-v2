import { defineMessages } from 'react-intl';

const domain = 'app.admissions.legacy.scanQr';

const messages = defineMessages({
  title: {
    id: `${domain}.title`,
    defaultMessage: 'کارڈ کو استمعال کریں',
  },
  subtitle: {
    id: `${domain}.subtitle`,
    defaultMessage:
      'اپنا دانشگاہِ رمضان کارڈ کیمرے کے سامنے رکھیں، کارڈ کو فریم کے عین درمیان رکھیں اور کیو آر کوڈ واضح نظر آئے۔\nاگر کیمرہ کی اجازت مانگی جائے تو اجازت دے دیں۔',
  },
});

export default messages;
