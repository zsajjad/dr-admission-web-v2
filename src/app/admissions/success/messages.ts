import { defineMessages } from 'react-intl';

const domain = 'app.admissions.success';

export default defineMessages({
  title: {
    id: `${domain}.title`,
    defaultMessage: 'درخواست جمع ہوگئی',
  },
  subtitle: {
    id: `${domain}.subtitle`,
    defaultMessage: 'خوش آمدید! آپ کی داخلہ درخواست موصول ہو گئی ہے۔',
  },
  body: {
    id: `${domain}.body`,
    defaultMessage: 'براہِ کرم اگلے مرحلے کی ہدایات کے لئے یہ صفحہ محفوظ رکھیں۔',
  },
  grNumberLabel: {
    id: `${domain}.grNumberLabel`,
    defaultMessage: 'جی آر نمبر',
  },
});
