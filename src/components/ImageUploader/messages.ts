import { defineMessages } from 'react-intl';

const domain = 'components.imageUploader';

const messages = defineMessages({
  // Upload options menu
  menuTitle: {
    id: `${domain}.menuTitle`,
    defaultMessage: 'تصویر اپلوڈ کریں',
  },
  selectFromGallery: {
    id: `${domain}.selectFromGallery`,
    defaultMessage: 'گیلری سے منتخب کریں',
  },
  selectFromGalleryHint: {
    id: `${domain}.selectFromGalleryHint`,
    defaultMessage: 'پہلے سے موجود تصویر چنیں',
  },
  takePhoto: {
    id: `${domain}.takePhoto`,
    defaultMessage: 'تصویر کھینچیں',
  },
  takePhotoHint: {
    id: `${domain}.takePhotoHint`,
    defaultMessage: 'کیمرے سے تصویر لیں',
  },

  // Upload states
  placeholder: {
    id: `${domain}.placeholder`,
    defaultMessage: 'تصویر اپلوڈ کریں',
  },
  placeholderHint: {
    id: `${domain}.placeholderHint`,
    defaultMessage: 'گیلری یا کیمرے سے تصویر منتخب کرنے کے لیے کلک کریں',
  },
  optimizing: {
    id: `${domain}.optimizing`,
    defaultMessage: 'تصویر بہتر بنائی جا رہی ہے…',
  },
  uploading: {
    id: `${domain}.uploading`,
    defaultMessage: 'اپلوڈ ہو رہی ہے…',
  },
  deleting: {
    id: `${domain}.deleting`,
    defaultMessage: 'حذف ہو رہی ہے…',
  },
  loadFailed: {
    id: `${domain}.loadFailed`,
    defaultMessage: 'تصویر لوڈ نہیں ہو سکی',
  },

  // Success messages
  uploadSuccess: {
    id: `${domain}.uploadSuccess`,
    defaultMessage: 'تصویر کامیابی سے اپلوڈ ہو گئی',
  },
  deleteSuccess: {
    id: `${domain}.deleteSuccess`,
    defaultMessage: 'تصویر کامیابی سے حذف ہو گئی',
  },

  // Error messages
  uploadError: {
    id: `${domain}.uploadError`,
    defaultMessage: 'تصویر اپلوڈ نہیں ہو سکی۔ براہِ کرم دوبارہ کوشش کریں۔',
  },
  deleteError: {
    id: `${domain}.deleteError`,
    defaultMessage: 'تصویر حذف نہیں ہو سکی۔ براہِ کرم دوبارہ کوشش کریں۔',
  },
  cameraError: {
    id: `${domain}.cameraError`,
    defaultMessage: 'کیمرے تک رسائی نہیں۔ براہِ کرم کیمرے کی اجازت دیں۔',
  },
  invalidFileType: {
    id: `${domain}.invalidFileType`,
    defaultMessage: 'صرف JPG یا JPEG تصویر اپلوڈ کریں۔',
  },
});

export default messages;
