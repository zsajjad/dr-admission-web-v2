import { defineMessages } from 'react-intl';

const domain = 'app.admissions.legacy.phoneSearch';

const messages = defineMessages({
  title: {
    id: `${domain}.title`,
    defaultMessage: 'فون نمبر سے تلاش',
  },
  subtitle: {
    id: `${domain}.subtitle`,
    defaultMessage:
      'گذشتہ سال آپ نے جس فون نمبر کے ذریعے طالبِ علم کا داخلہ کروایا تھا وہ درج کریں۔\nاگر طالبِ علم کا نام آجائے تو اسے دبا کر آگے بڑھ جائیں۔',
  },
  phoneNumberLabel: {
    id: `${domain}.phoneNumberLabel`,
    defaultMessage: 'فون نمبر',
  },
  phoneNumberSearchError: {
    id: `${domain}.phoneNumberSearchError`,
    defaultMessage: 'فون نمبر سے تلاش کرنے میں ناکام رہا۔ لطفاً دوبارہ کوشش کریں۔',
  },
  phoneNumberSearchNoData: {
    id: `${domain}.phoneNumberSearchNoData`,
    defaultMessage: 'فون نمبر کے لئے کوئی ریکارڈ نہیں ملا۔',
  },
  phoneNumberLengthError: {
    id: `${domain}.phoneNumberLengthError`,
    defaultMessage: 'مکمل ۱۱ ہندسے کا فون نمبر درج کریں۔',
  },
  phoneNumberSearchInfo: {
    id: `${domain}.phoneNumberSearchInfo`,
    defaultMessage: 'فون نمبر سے تلاش جاری ہے، انتظار کریں۔',
  },
  phoneNumberSearchSuccessHeading: {
    id: `${domain}.phoneNumberSearchSuccess`,
    defaultMessage: 'طالب علم منتخب کریں',
  },
  phoneNumberSearchSuccessDescription: {
    id: `${domain}.phoneNumberSearchSuccessDescription`,
    defaultMessage: 'طالب علم کو منتخب کر کے ابتدائی سے پہلے فرم کو پہلے پر لگائیں۔',
  },
  alreadyRegisteredHeading: {
    id: `${domain}.alreadyRegisteredHeading`,
    defaultMessage:
      'ان طلبا کا داخلہ اس سال کے لئے ہوچکا ہے، برائے کرم فیس جمع کروا کر پہلے آئیں پہلے پائیں کی بنیاد پر داخلہ کنفرم کریں',
  },
});

export default messages;
