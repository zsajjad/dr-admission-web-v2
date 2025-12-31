import { defineMessages } from 'react-intl';

const scope = 'app.components.qr';

const messages = defineMessages({
  permissionPromptTitle: {
    id: `${scope}.permissionPromptTitle`,
    defaultMessage: 'کیمرہ کی اجازت درکار ہے',
  },
  permissionPromptBody: {
    id: `${scope}.permissionPromptBody`,
    defaultMessage: 'براہِ کرم جب اجازت پوچھی جائے تو اجازت دے دیں تاکہ کیمرہ کھل سکے۔',
  },
  permissionDeniedTitle: {
    id: `${scope}.permissionDeniedTitle`,
    defaultMessage: 'کیمرہ کی اجازت نہیں ملی',
  },
  permissionDeniedBody: {
    id: `${scope}.permissionDeniedBody`,
    defaultMessage:
      'کیمرہ استعمال کرنے کے لیے اجازت درکار ہے۔ براہِ کرم براؤزر یا موبائل کی سیٹنگز میں جا کر کیمرہ کی اجازت آن کریں، پھر دوبارہ کوشش کریں۔',
  },
  noCameraTitle: {
    id: `${scope}.noCameraTitle`,
    defaultMessage: 'کیمرہ دستیاب نہیں',
  },
  noCameraBody: {
    id: `${scope}.noCameraBody`,
    defaultMessage: 'اس ڈیوائس میں کیمرہ نہیں ملا۔ براہِ کرم کیمرہ والی ڈیوائس استعمال کریں۔',
  },
  genericError: {
    id: `${scope}.genericError`,
    defaultMessage: 'کیمرہ کھولنے میں مسئلہ آیا۔ براہِ کرم دوبارہ کوشش کریں۔',
  },
  insecureContextTitle: {
    id: `${scope}.insecureContextTitle`,
    defaultMessage: 'کیمرہ اس لنک پر نہیں کھلے گا',
  },
  insecureContextBody: {
    id: `${scope}.insecureContextBody`,
    defaultMessage:
      'کیمرہ صرف محفوظ کنکشن (ایچ ٹی ٹی پی ایس) پر کام کرتا ہے۔ براہِ کرم محفوظ لنک استعمال کریں، پھر دوبارہ کوشش کریں۔',
  },
  scanningHint: {
    id: `${scope}.scanningHint`,
    defaultMessage:
      'دانشگاہِ رمضان کا کارڈ کیمرے کے سامنے لائیں، کارڈ کو فریم کے درمیان رکھیں اور کیو آر کوڈ کو سیدھا رکھیں۔ روشنی بہتر ہو تو اسکین جلد ہوگا۔',
  },
  invalidQr: {
    id: `${scope}.invalidQr`,
    defaultMessage: 'یہ درست کیو آر کوڈ نہیں ہے۔ براہِ کرم دانشگاہِ رمضان کا کارڈ اسکین کریں۔',
  },
  tryAgain: {
    id: `${scope}.tryAgain`,
    defaultMessage: 'براہِ کرم دوبارہ کوشش کریں۔',
  },
  retryScanButton: {
    id: `${scope}.retryScanButton`,
    defaultMessage: 'دوبارہ اسکین کریں',
  },
  startCameraButton: {
    id: `${scope}.startCameraButton`,
    defaultMessage: 'کیمرہ شروع کریں',
  },
});

export default messages;
