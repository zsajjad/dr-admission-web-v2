import * as Yup from 'yup';

import { ENGLISH_ONLY_REGEX } from '@/modules/admissions/validations/englishOnly';

export type AdmissionFormValues = {
  // branch/location
  branchId: string;
  areaId: string;

  // personal
  name: string;
  fatherName: string;
  dateOfBirth: string; // ISO string (yyyy-mm-dd)
  gender: 'MALE' | 'FEMALE' | '';
  identityNumber: string;

  // contact
  phone: string;
  alternatePhone: string;

  // address
  addressLine: string;
  localityOrCity: string;

  // education
  schoolName: string;
  schoolClass: string;
  lastYearClass: string;

  // flags
  vanRequired: boolean | null;
  isWorking: boolean;
  isMarried: boolean;

  // docs (placeholders; upload integration pending)
  identityProofAssetId: string | null;
  studentPhotoAssetId: string | null;
};

export type AdmissionFormSchemaMessages = {
  errBranchRequired: string;
  errAreaRequired: string;
  errStudentNameRequired: string;
  errStudentNameLettersOnly: string;
  errFatherNameRequired: string;
  errFatherNameLettersOnly: string;
  errDobRequired: string;
  errDobInvalid: string;
  errDobInFuture: string;
  errDobTooYoung: string;
  errDobTooEarly: string;
  errDobTooLate: string;
  errGenderRequired: string;
  errPhoneRequired: string;
  errPhoneDigitsOnly: string;
  errPhoneLength: string;
  errPhoneFormat: string;
  errIdentityDigitsOnly: string;
  errAddressRequired: string;
  errSchoolRequired: string;
  errSchoolMinLength: string;
  errVanRequired: string;
  errEnglishOnly: string;
  errIdentityProofRequired: string;
};

export function getAdmissionFormSchema(opts: {
  isLegacyPrefill: boolean;
  messages: AdmissionFormSchemaMessages;
  vanAvailable?: boolean;
}) {
  const { messages, vanAvailable = true } = opts;

  const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]*$/;
  const DIGITS_ONLY_REGEX = /^\d+$/;
  const DIGITS_AND_DASHES_REGEX = /^[0-9-]*$/;
  const PK_MOBILE_REGEX = /^03\d{9}$/; // Pakistani mobile: starts with 03, 11 digits total

  const parseDateOnlyUtc = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    // Validate that the date didn't roll over (e.g., 2025-02-31)
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      return null;
    }
    return date;
  };

  const englishText = () => Yup.string().trim().matches(ENGLISH_ONLY_REGEX, messages.errEnglishOnly);

  const nameText = (lettersOnlyMessage: string) => Yup.string().trim().matches(NAME_REGEX, lettersOnlyMessage);

  const minAgeYears = 6;
  const freshDobMinUtc = new Date(Date.UTC(2001, 0, 1));
  const freshDobMaxUtc = new Date(Date.UTC(2020, 11, 31));

  return Yup.object({
    branchId: Yup.string().required(messages.errBranchRequired),
    areaId: Yup.string().required(messages.errAreaRequired),

    name: nameText(messages.errStudentNameLettersOnly).required(messages.errStudentNameRequired),
    fatherName: nameText(messages.errFatherNameLettersOnly).required(messages.errFatherNameRequired),
    dateOfBirth: (() => {
      let schema = Yup.string()
        .required(messages.errDobRequired)
        .test('dob-valid', messages.errDobInvalid, (value) => {
          if (!value) return true;
          return !!parseDateOnlyUtc(value);
        });

      // Legacy-prefill may contain older DOBs; do not apply strict range there.
      if (opts.isLegacyPrefill) {
        schema = schema
          .test('dob-not-future', messages.errDobInFuture, (value) => {
            if (!value) return true;
            const dob = parseDateOnlyUtc(value);
            if (!dob) return true;
            const now = new Date();
            const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            return dob.getTime() <= todayUtc.getTime();
          })
          .test('dob-min-age', messages.errDobTooYoung, (value) => {
            if (!value) return true;
            const dob = parseDateOnlyUtc(value);
            if (!dob) return true;
            const now = new Date();
            const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const maxDobUtc = new Date(
              Date.UTC(todayUtc.getUTCFullYear() - minAgeYears, todayUtc.getUTCMonth(), todayUtc.getUTCDate()),
            );
            // Too young if DOB is after the latest allowed DOB
            return dob.getTime() <= maxDobUtc.getTime();
          });
      } else {
        schema = schema
          .test('dob-min-bound', messages.errDobTooEarly, (value) => {
            if (!value) return true;
            const dob = parseDateOnlyUtc(value);
            if (!dob) return true;
            return dob.getTime() >= freshDobMinUtc.getTime();
          })
          .test('dob-max-bound', messages.errDobTooLate, (value) => {
            if (!value) return true;
            const dob = parseDateOnlyUtc(value);
            if (!dob) return true;
            return dob.getTime() <= freshDobMaxUtc.getTime();
          });
      }

      return schema;
    })(),
    gender: Yup.mixed<'MALE' | 'FEMALE'>()
      .oneOf(['MALE', 'FEMALE'], messages.errGenderRequired)
      .required(messages.errGenderRequired),
    identityNumber: Yup.string().trim().matches(DIGITS_AND_DASHES_REGEX, messages.errIdentityDigitsOnly),

    phone: Yup.string()
      .trim()
      .matches(DIGITS_ONLY_REGEX, messages.errPhoneDigitsOnly)
      .length(11, messages.errPhoneLength)
      .matches(PK_MOBILE_REGEX, messages.errPhoneFormat)
      .required(messages.errPhoneRequired),
    alternatePhone: Yup.string()
      .trim()
      .test('alt-phone-digits', messages.errPhoneDigitsOnly, (value) => {
        if (!value) return true;
        return DIGITS_ONLY_REGEX.test(value);
      })
      .test('alt-phone-length', messages.errPhoneLength, (value) => {
        if (!value) return true;
        return value.length === 11;
      })
      .test('alt-phone-format', messages.errPhoneFormat, (value) => {
        if (!value) return true;
        return PK_MOBILE_REGEX.test(value);
      }),

    addressLine: englishText().required(messages.errAddressRequired),
    localityOrCity: englishText(),

    schoolName: englishText().min(4, messages.errSchoolMinLength).required(messages.errSchoolRequired),
    schoolClass: englishText(),
    lastYearClass: englishText(),

    vanRequired: vanAvailable
      ? Yup.boolean().nullable().required(messages.errVanRequired)
      : Yup.boolean().nullable().notRequired(),

    isWorking: Yup.boolean().default(false),
    isMarried: Yup.boolean().default(false),

    identityProofAssetId: opts.isLegacyPrefill
      ? Yup.string().nullable()
      : Yup.string().required(messages.errIdentityProofRequired),
    studentPhotoAssetId: Yup.string().nullable(),
  });
}
