'use client';

import { useEffect, useMemo, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useIntl } from 'react-intl';

import { useRouter } from 'next/navigation';

import { Alert, Container, Stack } from '@mui/material';

import { FormikProvider, type FormikErrors, type FormikTouched, useFormik } from 'formik';

import { useFormattedMessage } from '@/theme/FormattedMessage';
import { PageContainer } from '@/theme/Page';

import { useSubmitAdmissionApplication } from '@/modules/admissions/infrastructure/admissions/useSubmitAdmissionApplication';
import {
  LegacySearchResult,
  searchLegacyAdmissions,
} from '@/modules/admissions/infrastructure/legacy/legacySearchRepository';
import { decodeLegacyLookupToken, encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';

import { getAdmissionFormSchema, type AdmissionFormValues } from './admissionFormSchema';
import {
  AreaSection,
  EducationSection,
  LegacySummaryCard,
  SectionCard,
  StickySubmitBar,
  TextField,
} from './components';
import messages from './messages';
import { NewAdmissionApplication } from './NewAdmissionApplication';
import { getAdmissionFormSchemaMessages } from './schemaMessages';

function toDateOnly(value: string | undefined | null): string {
  if (!value) return '';
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? '';
}

export function LegacyAdmissionApplication({ legacyToken }: { legacyToken: string }) {
  const intl = useIntl();
  const router = useRouter();
  const decodedLegacy = useMemo(() => (legacyToken ? decodeLegacyLookupToken(legacyToken) : null), [legacyToken]);
  const legacyQuery = decodedLegacy?.query ?? '';

  const { submit, mutation, missingSessionId } = useSubmitAdmissionApplication();

  const [prefill, setPrefill] = useState<Partial<
    LegacySearchResult['data'][0]['prefill'] & { grNumber?: string; _legacyQuery?: string }
  > | null>(null);

  const legacyPrefillMutation = useMutation({
    mutationFn: async (query: string) => searchLegacyAdmissions(query),
  });

  useEffect(() => {
    // Invalid token → redirect to clean "new admission" URL (no legacy param).
    if (!legacyQuery) {
      router.replace('/admissions/application');
    }
  }, [legacyQuery, router]);

  useEffect(() => {
    if (!legacyQuery) return;
    // Prevent refetch loop: if we already fetched for this query, do nothing.
    if (prefill?._legacyQuery === legacyQuery) return;
    let cancelled = false;
    async function run() {
      const res = await legacyPrefillMutation.mutateAsync(legacyQuery);
      const row = res.data?.[0];
      if (!row || cancelled) return;
      setPrefill({ ...row.prefill, grNumber: row.grNumber, _legacyQuery: legacyQuery });
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [legacyQuery, prefill?._legacyQuery]);

  const initialValues = useMemo<AdmissionFormValues>(
    () => ({
      branchId: prefill?.branchId ?? '',
      areaId: prefill?.areaId ?? '',

      name: prefill?.name ?? '',
      fatherName: prefill?.fatherName ?? '',
      dateOfBirth: toDateOnly(prefill?.dateOfBirth) ?? '',
      gender: (prefill?.gender as 'MALE' | 'FEMALE' | '') ?? '',
      identityNumber: prefill?.identityNumber ?? '',

      phone: prefill?.phone ?? '',
      alternatePhone: prefill?.alternatePhone ?? '',

      addressLine: prefill?.address ?? '',
      localityOrCity: 'Karachi',

      schoolName: prefill?.schoolName ?? '',
      schoolClass: prefill?.schoolClass ?? '',

      lastYearClass: prefill?.lastYearClass ?? '',

      vanRequired: prefill?.vanRequired ?? null,

      identityProofFile: null,
      studentPhotoFile: null,
      isWorking: prefill?.isWorking ?? false,
      isMarried: prefill?.isMarried ?? false,

      identityProofAssetId: null,
      studentPhotoAssetId: null,
    }),
    [prefill],
  );

  const schema = useMemo(
    () => getAdmissionFormSchema({ isLegacyPrefill: true, messages: getAdmissionFormSchemaMessages(intl) }),
    [intl],
  );

  const formik = useFormik<AdmissionFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    validateOnMount: true,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      if (missingSessionId) {
        helpers.setStatus(intl.formatMessage(messages.missingSessionId));
        return;
      }

      try {
        const res = await submit(values, { legacyStudentId: prefill?.legacyStudentId });
        const grNumber = res?.data?.student?.grNumber;
        const token = encodeLegacyLookupToken(grNumber);
        router.push(`/admissions/success?gr=${encodeURIComponent(token)}`);
      } catch {
        helpers.setStatus(intl.formatMessage(messages.submitError));
      }
    },
  });

  const { values, setFieldValue } = formik;

  // City is fixed.
  useEffect(() => {
    if (values.localityOrCity !== 'Karachi') {
      void setFieldValue('localityOrCity', 'Karachi');
    }
  }, [setFieldValue, values.localityOrCity]);

  const scrollToFirstError = (errors: FormikErrors<AdmissionFormValues>) => {
    const order: Array<keyof AdmissionFormValues> = [
      'areaId',
      'addressLine',
      'alternatePhone',
      'schoolName',
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
        areaId: true,
        addressLine: true,
        alternatePhone: true,
        schoolName: true,
        vanRequired: true,
      };
      formik.setTouched(touched, true);
      scrollToFirstError(errors);
      return;
    }
    await formik.submitForm();
  };

  const title = useFormattedMessage<string>(messages.title);
  const subtitle = useFormattedMessage<string>(messages.subtitleLegacyPrefill);

  if (!legacyQuery) return null;

  if (legacyPrefillMutation.isError && !prefill) {
    // Legacy lookup failed → user should proceed with a fresh admission.
    return <NewAdmissionApplication />;
  }

  return (
    <PageContainer
      pageTitle={{
        title: { text: title, language: 'ur' },
        subtitle: { text: subtitle, language: 'ur' },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={2} sx={{ pb: 12 }}>
          {missingSessionId ? (
            <Alert severity="error" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)' }}>
              {intl.formatMessage(messages.missingSessionId)}
            </Alert>
          ) : null}

          {legacyPrefillMutation.isPending ? (
            <Alert severity="info" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)' }}>
              {intl.formatMessage(messages.legacyLoading)}
            </Alert>
          ) : null}
          {legacyPrefillMutation.isError ? (
            <Alert severity="warning" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)' }}>
              {intl.formatMessage(messages.legacyLoadError)}
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

                <LegacySummaryCard
                  titleMessage={messages.sectionSummary}
                  descriptionMessage={messages.sectionSummaryDesc}
                  prefill={prefill}
                />

                <AreaSection />

                <SectionCard
                  titleMessage={messages.sectionContact}
                  descriptionMessage={messages.sectionLegacyContactDesc}
                  descriptionValues={{ phone: prefill?.phone ?? '—' }}
                >
                  <Stack spacing={2}>
                    <TextField
                      name="alternatePhone"
                      labelMessage={messages.labelAlternatePhone}
                      inputDir="ltr"
                      slotProps={{ htmlInput: { autoComplete: 'tel' } }}
                    />
                  </Stack>
                </SectionCard>
                <EducationSection />

                {/* Van selection moved into Address section (area-specific). */}
              </Stack>
            </form>
          </FormikProvider>
        </Stack>
      </Container>
      <StickySubmitBar
        submitMessage={messages.submitButton}
        hintMessage={messages.englishOnlyHint}
        disabled={formik.isSubmitting || mutation.isPending || missingSessionId || legacyPrefillMutation.isPending}
        onPress={onStickySubmit}
      />
    </PageContainer>
  );
}
