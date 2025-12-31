'use client';

import type { IntlShape } from 'react-intl';

import type { AdmissionFormSchemaMessages } from './admissionFormSchema';
import messages from './messages';

export function getAdmissionFormSchemaMessages(intl: IntlShape): AdmissionFormSchemaMessages {
  return {
    errBranchRequired: intl.formatMessage(messages.errBranchRequired),
    errAreaRequired: intl.formatMessage(messages.errAreaRequired),
    errStudentNameRequired: intl.formatMessage(messages.errStudentNameRequired),
    errStudentNameLettersOnly: intl.formatMessage(messages.errStudentNameLettersOnly),
    errFatherNameRequired: intl.formatMessage(messages.errFatherNameRequired),
    errFatherNameLettersOnly: intl.formatMessage(messages.errFatherNameLettersOnly),
    errDobRequired: intl.formatMessage(messages.errDobRequired),
    errDobInvalid: intl.formatMessage(messages.errDobInvalid),
    errDobInFuture: intl.formatMessage(messages.errDobInFuture),
    errDobTooYoung: intl.formatMessage(messages.errDobTooYoung),
    errDobTooEarly: intl.formatMessage(messages.errDobTooEarly),
    errDobTooLate: intl.formatMessage(messages.errDobTooLate),
    errGenderRequired: intl.formatMessage(messages.errGenderRequired),
    errPhoneRequired: intl.formatMessage(messages.errPhoneRequired),
    errPhoneDigitsOnly: intl.formatMessage(messages.errPhoneDigitsOnly),
    errPhoneLength: intl.formatMessage(messages.errPhoneLength),
    errPhoneFormat: intl.formatMessage(messages.errPhoneFormat),
    errIdentityDigitsOnly: intl.formatMessage(messages.errIdentityDigitsOnly),
    errAddressRequired: intl.formatMessage(messages.errAddressRequired),
    errSchoolRequired: intl.formatMessage(messages.errSchoolRequired),
    errSchoolMinLength: intl.formatMessage(messages.errSchoolMinLength),
    errVanRequired: intl.formatMessage(messages.errVanRequired),
    errEnglishOnly: intl.formatMessage(messages.errEnglishOnly),
    errIdentityProofRequired: intl.formatMessage(messages.errIdentityProofRequired),
  };
}
