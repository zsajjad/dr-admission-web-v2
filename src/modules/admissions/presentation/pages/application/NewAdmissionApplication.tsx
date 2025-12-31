'use client';

import { useEffect } from 'react';

import { useIntl } from 'react-intl';

import { useRouter } from 'next/navigation';

import { Alert, Container, Stack } from '@mui/material';

import { FormikProvider, type FormikErrors, type FormikTouched, useFormik } from 'formik';

import { PageContainer } from '@/theme/Page';

import { useSubmitAdmissionApplication } from '@/modules/admissions/infrastructure/admissions/useSubmitAdmissionApplication';
import { encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';

import { getAdmissionFormSchema, type AdmissionFormValues } from './admissionFormSchema';
import {
  AreaSelect,
  BranchSelect,
  GenderSelect,
  SectionCard,
  StickySubmitBar,
  TextField,
  VanSelect,
} from './components';
import { useAreaHasVan } from './hooks/useSelectedArea';
import messages from './messages';
import { getAdmissionFormSchemaMessages } from './schemaMessages';

const initialValues: AdmissionFormValues = {
  branchId: '',
  areaId: '',
  name: '',
  fatherName: '',
  dateOfBirth: '',
  gender: '',
  identityNumber: '',
  phone: '',
  alternatePhone: '',
  addressLine: '',
  localityOrCity: 'Karachi',
  schoolName: '',
  lastYearClass: '',
  vanRequired: null,
  identityProofFile: null,
  studentPhotoFile: null,
};

export function NewAdmissionApplication() {
  const intl = useIntl();
  const router = useRouter();
  const { submit, mutation, missingSessionId } = useSubmitAdmissionApplication();

  const formik = useFormik<AdmissionFormValues>({
    enableReinitialize: false,
    initialValues,
    validationSchema: getAdmissionFormSchema({
      isLegacyPrefill: false,
      messages: getAdmissionFormSchemaMessages(intl),
    }),
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      if (values.identityProofFile || values.studentPhotoFile) {
        helpers.setStatus(intl.formatMessage(messages.docUploadNotWired));
        return;
      }

      if (missingSessionId) {
        helpers.setStatus(intl.formatMessage(messages.missingSessionId));
        return;
      }

      try {
        const res = await submit(values);
        const grNumber = res?.data?.student?.grNumber;
        if (grNumber) {
          const token = encodeLegacyLookupToken(grNumber);
          router.push(`/admissions/success?gr=${encodeURIComponent(token)}`);
        } else {
          router.push('/admissions/success');
        }
      } catch {
        helpers.setStatus(intl.formatMessage(messages.submitError));
      }
    },
  });

  const { values, setFieldValue } = formik;

  // If selected area doesn't have van, force value to false and keep it out of the UI.
  const computedAreaHasVan = useAreaHasVan(values.branchId || undefined, values.areaId || undefined);
  useEffect(() => {
    if (!computedAreaHasVan && values.vanRequired !== false) {
      void setFieldValue('vanRequired', false);
    }
  }, [computedAreaHasVan, setFieldValue, values.vanRequired]);

  // City is fixed.
  useEffect(() => {
    if (values.localityOrCity !== 'Karachi') {
      void setFieldValue('localityOrCity', 'Karachi');
    }
  }, [setFieldValue, values.localityOrCity]);

  const scrollToFirstError = (errors: FormikErrors<AdmissionFormValues>) => {
    const order: Array<keyof AdmissionFormValues> = [
      'branchId',
      'name',
      'fatherName',
      'dateOfBirth',
      'gender',
      'identityNumber',
      'phone',
      'alternatePhone',
      'areaId',
      'addressLine',
      'schoolName',
      'lastYearClass',
      'vanRequired',
    ];
    const first = order.find((k) => !!errors[k]);
    const targetName = first ?? (Object.keys(errors)[0] as keyof AdmissionFormValues | undefined);
    if (!targetName) return;

    const el =
      document.getElementById(String(targetName)) ??
      document.querySelector(`[name="${String(targetName)}"]`) ??
      document.querySelector(`[data-field="${String(targetName)}"]`);

    if (el && 'scrollIntoView' in el) {
      (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLElement).focus?.({ preventScroll: true });
    }
  };

  const onStickySubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length) {
      const touched: FormikTouched<AdmissionFormValues> = {
        branchId: true,
        areaId: true,
        name: true,
        fatherName: true,
        dateOfBirth: true,
        gender: true,
        identityNumber: true,
        phone: true,
        alternatePhone: true,
        addressLine: true,
        schoolName: true,
        lastYearClass: true,
        vanRequired: true,
      };
      formik.setTouched(touched, true);
      scrollToFirstError(errors);
      return;
    }
    await formik.submitForm();
  };

  return (
    <PageContainer
      pageTitle={{
        title: { text: intl.formatMessage(messages.title), language: 'ur' },
        subtitle: { text: intl.formatMessage(messages.subtitleFresh), language: 'ur' },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={2} sx={{ pb: 12 }}>
          {missingSessionId ? (
            <Alert severity="error" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)' }}>
              {intl.formatMessage(messages.missingSessionId)}
            </Alert>
          ) : null}

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                {formik.status ? (
                  <Alert severity="info" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)' }}>
                    {formik.status}
                  </Alert>
                ) : null}
                {mutation.isError ? (
                  <Alert severity="error" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)' }}>
                    {intl.formatMessage(messages.submitError)}
                  </Alert>
                ) : null}

                <SectionCard
                  titleMessage={messages.sectionBranchLocation}
                  descriptionMessage={messages.sectionBranchLocationDesc}
                >
                  <Stack spacing={2}>
                    <BranchSelect
                      labelMessage={messages.labelBranch}
                      loadingMessage={messages.dropdownLoading}
                      emptyMessage={messages.dropdownEmpty}
                    />
                  </Stack>
                </SectionCard>

                <SectionCard titleMessage={messages.sectionPersonal} descriptionMessage={messages.sectionPersonalDesc}>
                  <Stack spacing={2}>
                    <TextField name="name" labelMessage={messages.labelStudentName} inputDir="ltr" />
                    <TextField name="fatherName" labelMessage={messages.labelFatherName} inputDir="ltr" />
                    <TextField
                      name="dateOfBirth"
                      labelMessage={messages.labelDob}
                      type="date"
                      slotProps={{ inputLabel: { shrink: true } }}
                      inputDir="ltr"
                    />
                    <GenderSelect
                      name="gender"
                      labelMessage={messages.labelGender}
                      placeholderMessage={messages.dropdownPlaceholder}
                      maleMessage={messages.genderMale}
                      femaleMessage={messages.genderFemale}
                    />
                    <TextField name="identityNumber" labelMessage={messages.labelIdentityNumber} inputDir="ltr" />
                  </Stack>
                </SectionCard>

                <SectionCard titleMessage={messages.sectionContact} descriptionMessage={messages.sectionContactDesc}>
                  <Stack spacing={2}>
                    <TextField
                      name="phone"
                      labelMessage={messages.labelPhone}
                      inputDir="ltr"
                      slotProps={{ htmlInput: { autoComplete: 'tel' } }}
                    />
                    <TextField
                      name="alternatePhone"
                      labelMessage={messages.labelAlternatePhone}
                      inputDir="ltr"
                      slotProps={{ htmlInput: { autoComplete: 'tel' } }}
                    />
                  </Stack>
                </SectionCard>

                <SectionCard titleMessage={messages.sectionAddress} descriptionMessage={messages.sectionAddressDesc}>
                  <Stack spacing={2}>
                    <AreaSelect
                      labelMessage={messages.labelArea}
                      loadingMessage={messages.dropdownLoading}
                      emptyMessage={messages.dropdownEmpty}
                      selectBranchFirstMessage={messages.selectBranchFirst}
                    />
                    <TextField
                      name="addressLine"
                      labelMessage={messages.labelAddress}
                      multiline
                      minRows={3}
                      inputDir="ltr"
                    />
                    {computedAreaHasVan ? (
                      <Stack spacing={1} sx={{ direction: 'rtl' }}>
                        <VanSelect labelMessage={messages.labelVanRequired} />
                      </Stack>
                    ) : null}
                  </Stack>
                </SectionCard>

                <SectionCard
                  titleMessage={messages.sectionEducation}
                  descriptionMessage={messages.sectionEducationDesc}
                >
                  <Stack spacing={1}>
                    <TextField name="schoolName" labelMessage={messages.labelSchool} inputDir="ltr" />
                    <TextField name="schoolClass" labelMessage={messages.labelSchoolClass} inputDir="ltr" />
                  </Stack>
                </SectionCard>

                {/* Van selection moved into Address section (area-specific). */}
              </Stack>
            </form>
          </FormikProvider>
        </Stack>
      </Container>
      <StickySubmitBar
        submitMessage={messages.submitButton}
        hintMessage={messages.englishOnlyHint}
        disabled={formik.isSubmitting || mutation.isPending || missingSessionId}
        onPress={onStickySubmit}
      />
    </PageContainer>
  );
}
