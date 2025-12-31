import { defineMessages } from 'react-intl';

const domain = 'app.admissions.application';

const messages = defineMessages({
  title: {
    id: `${domain}.title`,
    defaultMessage: 'داخلہ فارم',
  },
  subtitleFresh: {
    id: `${domain}.subtitleFresh`,
    defaultMessage: 'براہِ کرم نیچے دی گئی معلومات پُر کریں۔ تمام معلومات انگریزی میں درج کریں۔',
  },
  subtitleLegacyPrefill: {
    id: `${domain}.subtitleLegacyPrefill`,
    defaultMessage:
      'دانشگاہِ رمضان میں خوش آمدید۔ ہمارے پاس آپ کی زیادہ تر معلومات پہلے سے موجود ہیں۔ اگر آپ دی گئی معلومات میں کوئی تبدیلی کرنا چاہتے ہیں تو کر لیں، ورنہ اس سال کے سیشن میں داخلے کی تصدیق کے لیے درخواست جمع کر دیں۔',
  },

  missingSessionId: {
    id: `${domain}.missingSessionId`,
    defaultMessage: 'سسٹم سیٹنگ موجود نہیں۔ داخلہ جمع کرنے کے لئے NEXT_PUBLIC_ADMISSIONS_ACTIVE_SESSION_ID سیٹ کریں۔',
  },

  legacyLoading: {
    id: `${domain}.legacyLoading`,
    defaultMessage: 'گذشتہ ریکارڈ لوڈ ہو رہا ہے…',
  },
  legacyLoadError: {
    id: `${domain}.legacyLoadError`,
    defaultMessage: 'گذشتہ ریکارڈ لوڈ نہیں ہو سکا۔ آپ دستی طور پر فارم پُر کر سکتے ہیں۔',
  },

  submitSuccess: {
    id: `${domain}.submitSuccess`,
    defaultMessage: 'فارم جمع ہو گیا۔ (سکسیس پیج جلد شامل کیا جائے گا)',
  },
  submitError: {
    id: `${domain}.submitError`,
    defaultMessage: 'فارم جمع نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔',
  },
  submitButton: {
    id: `${domain}.submitButton`,
    defaultMessage: 'درخواست جمع کریں',
  },
  docUploadNotWired: {
    id: `${domain}.docUploadNotWired`,
    defaultMessage: 'دستاویزات اپلوڈ کی سہولت ابھی دستیاب نہیں۔ براہِ کرم فائل ہٹا کر دوبارہ کوشش کریں۔',
  },

  sectionBranchLocation: {
    id: `${domain}.sectionBranchLocation`,
    defaultMessage: 'برانچ اور علاقہ',
  },
  sectionPersonal: {
    id: `${domain}.sectionPersonal`,
    defaultMessage: 'ذاتی معلومات',
  },
  sectionContact: {
    id: `${domain}.sectionContact`,
    defaultMessage: 'رابطہ معلومات',
  },
  sectionAddress: {
    id: `${domain}.sectionAddress`,
    defaultMessage: 'پتہ',
  },
  sectionEducation: {
    id: `${domain}.sectionEducation`,
    defaultMessage: 'تعلیم',
  },
  sectionAdditional: {
    id: `${domain}.sectionAdditional`,
    defaultMessage: 'مزید معلومات',
  },
  sectionSummary: {
    id: `${domain}.sectionSummary`,
    defaultMessage: 'ریکارڈ کی معلومات',
  },

  // Section descriptions (Urdu)
  sectionSummaryDesc: {
    id: `${domain}.sectionSummaryDesc`,
    defaultMessage: 'یہ معلومات گذشتہ ریکارڈ سے آئی ہے اور تبدیل نہیں کی جا سکتی۔',
  },
  sectionBranchLocationDesc: {
    id: `${domain}.sectionBranchLocationDesc`,
    defaultMessage: 'براہِ کرم اپنی برانچ منتخب کریں۔',
  },
  sectionPersonalDesc: {
    id: `${domain}.sectionPersonalDesc`,
    defaultMessage: 'براہِ کرم طالب علم کی بنیادی معلومات درج کریں۔',
  },
  sectionContactDesc: {
    id: `${domain}.sectionContactDesc`,
    defaultMessage: 'رابطہ کے لئے فون نمبر درج کریں۔',
  },
  sectionLegacyContactDesc: {
    id: `${domain}.sectionLegacyContactDesc`,
    defaultMessage:
      'آپ کا موجودہ فون نمبر {phone} ہے۔ اگر آپ کے پاس کوئی اور نمبر ہے تو براہِ کرم نیچے درج کریں۔ (اختیاری)',
  },
  sectionAddressDesc: {
    id: `${domain}.sectionAddressDesc`,
    defaultMessage: 'علاقہ منتخب کریں، پتہ درج کریں، اور اگر وین سروس درکار ہو تو انتخاب کریں۔',
  },
  sectionEducationDesc: {
    id: `${domain}.sectionEducationDesc`,
    defaultMessage: 'طالبِ کی روزمرہ تعلیم کے متعلق معلومات درج کریں۔',
  },
  sectionAdditionalDesc: {
    id: `${domain}.sectionAdditionalDesc`,
    defaultMessage: 'وین سروس درکار ہونے کی صورت میں “ہاں” منتخب کریں۔',
  },

  labelBranch: {
    id: `${domain}.labelBranch`,
    defaultMessage: 'برانچ',
  },
  labelArea: {
    id: `${domain}.labelArea`,
    defaultMessage: 'علاقہ',
  },
  dropdownLoading: {
    id: `${domain}.dropdownLoading`,
    defaultMessage: 'لوڈ ہو رہا ہے…',
  },
  dropdownEmpty: {
    id: `${domain}.dropdownEmpty`,
    defaultMessage: 'کوئی ریکارڈ موجود نہیں',
  },
  selectBranchFirst: {
    id: `${domain}.selectBranchFirst`,
    defaultMessage: 'پہلے برانچ منتخب کریں',
  },
  dropdownPlaceholder: {
    id: `${domain}.dropdownPlaceholder`,
    defaultMessage: '—',
  },

  labelStudentName: {
    id: `${domain}.labelStudentName`,
    defaultMessage: 'طالب علم کا نام',
  },
  labelFatherName: {
    id: `${domain}.labelFatherName`,
    defaultMessage: 'والد/سرپرست کا نام',
  },
  labelDob: {
    id: `${domain}.labelDob`,
    defaultMessage: 'تاریخِ پیدائش',
  },
  labelGender: {
    id: `${domain}.labelGender`,
    defaultMessage: 'جنس',
  },
  genderMale: {
    id: `${domain}.genderMale`,
    defaultMessage: 'لڑکا',
  },
  genderFemale: {
    id: `${domain}.genderFemale`,
    defaultMessage: 'لڑکی',
  },
  labelIdentityNumber: {
    id: `${domain}.labelIdentityNumber`,
    defaultMessage: 'ب فارم / شناختی نمبر (اختیاری)',
  },

  labelPhone: {
    id: `${domain}.labelPhone`,
    defaultMessage: 'فون نمبر',
  },
  labelAlternatePhone: {
    id: `${domain}.labelAlternatePhone`,
    defaultMessage: 'متبادل فون نمبر (اختیاری)',
  },

  labelAddress: {
    id: `${domain}.labelAddress`,
    defaultMessage: 'گھر کا پتہ',
  },
  labelCity: {
    id: `${domain}.labelCity`,
    defaultMessage: 'علاقہ / شہر (اختیاری)',
  },

  labelSchool: {
    id: `${domain}.labelSchool`,
    defaultMessage: 'تعلیمی ادارہ کا نام',
  },
  labelSchoolClass: {
    id: `${domain}.labelSchoolClass`,
    defaultMessage: 'جماعت',
  },

  labelVanRequired: {
    id: `${domain}.labelVanRequired`,
    defaultMessage: 'کیا طالبِ علم کو وین سروس کی ضرورت ہے؟',
  },
  englishOnlyHint: {
    id: `${domain}.englishOnlyHint`,
    defaultMessage: 'براہِ کرم تمام معلومات انگریزی میں درج کریں۔',
  },

  // Validation errors (Urdu)
  errBranchRequired: {
    id: `${domain}.errBranchRequired`,
    defaultMessage: 'برانچ منتخب کرنا ضروری ہے۔',
  },
  errAreaRequired: {
    id: `${domain}.errAreaRequired`,
    defaultMessage: 'علاقہ منتخب کرنا ضروری ہے۔',
  },
  errStudentNameRequired: {
    id: `${domain}.errStudentNameRequired`,
    defaultMessage: 'طالب علم کا نام ضروری ہے۔',
  },
  errStudentNameLettersOnly: {
    id: `${domain}.errStudentNameLettersOnly`,
    defaultMessage: 'طالب علم کے نام میں صرف انگریزی حروف درج کریں۔ نمبرز قبول نہیں۔',
  },
  errFatherNameRequired: {
    id: `${domain}.errFatherNameRequired`,
    defaultMessage: 'والد/سرپرست کا نام ضروری ہے۔',
  },
  errFatherNameLettersOnly: {
    id: `${domain}.errFatherNameLettersOnly`,
    defaultMessage: 'والد/سرپرست کے نام میں صرف انگریزی حروف درج کریں۔ نمبرز قبول نہیں۔',
  },
  errDobRequired: {
    id: `${domain}.errDobRequired`,
    defaultMessage: 'تاریخِ پیدائش ضروری ہے۔',
  },
  errDobInvalid: {
    id: `${domain}.errDobInvalid`,
    defaultMessage: 'براہِ کرم درست تاریخِ پیدائش درج کریں۔',
  },
  errDobInFuture: {
    id: `${domain}.errDobInFuture`,
    defaultMessage: 'تاریخِ پیدائش مستقبل کی نہیں ہو سکتی۔',
  },
  errDobTooYoung: {
    id: `${domain}.errDobTooYoung`,
    defaultMessage: 'کم از کم عمر 6 سال ہونی چاہیے۔',
  },
  errGenderRequired: {
    id: `${domain}.errGenderRequired`,
    defaultMessage: 'جنس منتخب کرنا ضروری ہے۔',
  },
  errPhoneRequired: {
    id: `${domain}.errPhoneRequired`,
    defaultMessage: 'فون نمبر ضروری ہے۔',
  },
  errPhoneDigitsOnly: {
    id: `${domain}.errPhoneDigitsOnly`,
    defaultMessage: 'فون نمبر میں صرف ہندسے درج کریں۔',
  },
  errPhoneLength: {
    id: `${domain}.errPhoneLength`,
    defaultMessage: 'فون نمبر مکمل 11 ہندسوں کا ہونا چاہیے۔',
  },
  errIdentityDigitsOnly: {
    id: `${domain}.errIdentityDigitsOnly`,
    defaultMessage: 'ب فارم/شناختی نمبر میں صرف ہندسے (اور ڈیش) درج کریں۔ حروف قبول نہیں۔',
  },
  errAddressRequired: {
    id: `${domain}.errAddressRequired`,
    defaultMessage: 'پتہ ضروری ہے۔',
  },
  errSchoolRequired: {
    id: `${domain}.errSchoolRequired`,
    defaultMessage: 'سکول کا نام ضروری ہے۔',
  },
  errSchoolMinLength: {
    id: `${domain}.errSchoolMinLength`,
    defaultMessage: 'سکول کا نام کم از کم 4 حروف پر مشتمل ہونا چاہیے۔',
  },
  errVanRequired: {
    id: `${domain}.errVanRequired`,
    defaultMessage: 'براہ کرم وین کے متعلق انتخاب کریں۔',
  },
  errEnglishOnly: {
    id: `${domain}.errEnglishOnly`,
    defaultMessage: 'براہِ کرم یہ معلومات صرف انگریزی میں درج کریں۔',
  },
  yes: {
    id: `${domain}.yes`,
    defaultMessage: 'ہاں',
  },
  no: {
    id: `${domain}.no`,
    defaultMessage: 'نہیں',
  },
});

export default messages;
