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
  lastYearClass: string;

  // flags
  vanRequired: boolean | null;

  // docs (placeholders; upload integration pending)
  identityProofFile: File | null;
  studentPhotoFile: File | null;
};

export function getAdmissionFormSchema(opts: { isLegacyPrefill: boolean }) {
  const { isLegacyPrefill } = opts;

  const englishText = (label: string) =>
    Yup.string()
      .trim()
      .matches(ENGLISH_ONLY_REGEX, `${label} must be in English only (A–Z, 0–9, and common punctuation).`);

  return Yup.object({
    branchId: Yup.string().required('Branch is required'),
    areaId: Yup.string().required('Area is required'),

    name: englishText('Student name').required('Student full name is required'),
    fatherName: englishText('Father/guardian name').required('Father/guardian name is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    gender: Yup.mixed<'MALE' | 'FEMALE'>()
      .oneOf(['MALE', 'FEMALE'], 'Gender is required')
      .required('Gender is required'),
    identityNumber: englishText('B-Form/CNIC number'),

    phone: Yup.string().trim().required('Phone number is required'),
    alternatePhone: Yup.string().trim(),

    addressLine: englishText('Address').required('Address is required'),
    localityOrCity: englishText('Locality/City'),

    schoolName: englishText('School name').required('School name is required'),
    lastYearClass: englishText('Last year class'),

    vanRequired: Yup.boolean().nullable().required('Please select whether van is required'),

    identityProofAssetId: Yup.string().trim().required('Identity proof is required'),
    studentPhotoAssetId: Yup.string().trim().required('Student photo is required'),
  });
}
