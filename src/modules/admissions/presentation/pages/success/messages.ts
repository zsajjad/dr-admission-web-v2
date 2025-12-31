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
  rulesTitle: {
    id: `${domain}.rulesTitle`,
    defaultMessage: 'قواعد و ضوابط',
  },
  rulesNotAvailable: {
    id: `${domain}.rulesNotAvailable`,
    defaultMessage: 'قواعد و ضوابط دستیاب نہیں ہیں۔',
  },

  // Tiflan Rules (Age 6-9)
  tiflanTitle: {
    id: `${domain}.tiflanTitle`,
    defaultMessage: 'طفلان محمدی (ص) (عمر ۶ تا ۹ سال)',
  },
  tiflanFeeDate: {
    id: `${domain}.tiflanFeeDate`,
    defaultMessage: '• فیس جمع کرانے کی تاریخ: یکم جنوری ۲۰۲۶',
  },
  tiflanFeeTime: {
    id: `${domain}.tiflanFeeTime`,
    defaultMessage: '• فیس جمع کرانے کا وقت: رات ۸ بجے سے ۱۰ بجے تک',
  },
  tiflanGuardianRule: {
    id: `${domain}.tiflanGuardianRule`,
    defaultMessage:
      '• طالب علم کے والدین یا سرپرست کو فیس جمع کرانے کے دن آنا ہوگا۔ خاندان کا کوئی اور فرد فیس جمع نہیں کرا سکتا۔',
  },
  tiflanDeadline: {
    id: `${domain}.tiflanDeadline`,
    defaultMessage: '• یکم جنوری ۲۰۲۶ کو رات ۱۰ بجے کے بعد کوئی داخلہ قبول نہیں ہوگا۔',
  },

  // Muhibaan Rules (Age 10-17)
  muhibaanTitle: {
    id: `${domain}.muhibaanTitle`,
    defaultMessage: 'محبان حیدری (ع) / ناصران حسینی (ع)',
  },
  forBoys: {
    id: `${domain}.forBoys`,
    defaultMessage: 'لڑکوں کے لیے',
  },
  forGirls: {
    id: `${domain}.forGirls`,
    defaultMessage: 'لڑکیوں کے لیے',
  },
  muhibaanBoysDay: {
    id: `${domain}.muhibaanBoysDay`,
    defaultMessage: '• فیس جمع کرانے کا دن: ہفتہ',
  },
  muhibaanBoysDate: {
    id: `${domain}.muhibaanBoysDate`,
    defaultMessage: '• فیس جمع کرانے کی تاریخ: یکم جنوری ۲۰۲۶',
  },
  muhibaanGirlsDay: {
    id: `${domain}.muhibaanGirlsDay`,
    defaultMessage: '• فیس جمع کرانے کا دن: اتوار',
  },
  muhibaanGirlsDate: {
    id: `${domain}.muhibaanGirlsDate`,
    defaultMessage: '• فیس جمع کرانے کی تاریخ: یکم جنوری ۲۰۲۶',
  },
  muhibaanTime: {
    id: `${domain}.muhibaanTime`,
    defaultMessage: '• فیس جمع کرانے کا وقت: رات ۷ بجے سے ۱۰ بجے تک',
  },
  commonRules: {
    id: `${domain}.commonRules`,
    defaultMessage: 'عمومی قواعد',
  },
  muhibaanStudentRule: {
    id: `${domain}.muhibaanStudentRule`,
    defaultMessage:
      '• طالب علم کو فیس جمع کرانے کے دن خود آنا ہوگا۔ کوئی اور شخص فیس جمع نہیں کرا سکتا اور کارڈ حاصل نہیں کر سکتا۔',
  },
  muhibaanCardDeadline: {
    id: `${domain}.muhibaanCardDeadline`,
    defaultMessage: '• فیس جمع کرانے کے دن رات ۱۰ بجے کے بعد کوئی کارڈ جاری نہیں ہوگا۔',
  },

  // Common Rules
  fees: {
    id: `${domain}.fees`,
    defaultMessage: '• فیس: ۳۰۰ روپے',
  },
  firstComeFirstServe: {
    id: `${domain}.firstComeFirstServe`,
    defaultMessage: '• داخلہ پہلے آئیں پہلے پائیں کی بنیاد پر دیا جائے گا۔',
  },
  seatsFilled: {
    id: `${domain}.seatsFilled`,
    defaultMessage: '• سیٹیں پوری ہونے کے بعد مزید داخلے قبول نہیں ہوں گے۔',
  },
  cardFirstComeFirstServe: {
    id: `${domain}.cardFirstComeFirstServe`,
    defaultMessage: '• کارڈ پہلے آئیں پہلے پائیں کی بنیاد پر جاری کیا جائے گا۔',
  },
  classSeatsFilled: {
    id: `${domain}.classSeatsFilled`,
    defaultMessage: '• کسی بھی کلاس کی سیٹیں پوری ہونے کے بعد اس کلاس کے لیے مزید کارڈ جاری نہیں ہوں گے۔',
  },

  // Contact Section
  contactTitle: {
    id: `${domain}.contactTitle`,
    defaultMessage: 'رابطہ',
  },
  whatsappCommunityLabel: {
    id: `${domain}.whatsappCommunityLabel`,
    defaultMessage: 'تازہ ترین معلومات کے لیے',
  },
  whatsappCommunity: {
    id: `${domain}.whatsappCommunity`,
    defaultMessage: 'واٹس ایپ کمیونٹی میں شامل ہوں',
  },
  contactNumber: {
    id: `${domain}.contactNumber`,
    defaultMessage: 'کسی بھی دوسرے معاملے کے لیے رابطہ کریں',
  },
  nextAdmission: {
    id: `${domain}.nextAdmission`,
    defaultMessage: 'اگلا داخلہ',
  },
  setReminder: {
    id: `${domain}.setReminder`,
    defaultMessage: 'یاد دہانی سیٹ کریں (1 گھنٹہ پہلے)',
  },
});
