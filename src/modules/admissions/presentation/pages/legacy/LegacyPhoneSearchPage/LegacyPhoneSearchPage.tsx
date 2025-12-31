'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import * as Yup from 'yup';

import { useRouter } from 'next/navigation';

import { CheckCircleOutlined, WarningOutlined, ErrorOutlined, InfoOutlined } from '@mui/icons-material';
import {
  Alert,
  AlertColor,
  Box,
  CircularProgress,
  Container,
  debounce,
  InputAdornment,
  List,
  TextField,
} from '@mui/material';

import { useFormik } from 'formik';

import { useAdmissionsControllerSearchLegacy } from '@/providers/service/admissions/admissions';
import { LegacyStudentRow } from '@/providers/service/app.schemas';

import { FormattedMessage, useFormattedMessage } from '@/theme/FormattedMessage';
import { PageContainer } from '@/theme/Page';

import { StudentListItem } from '@/modules/admissions/presentation/components/StudentListItem';
import { encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';

import messages from './messages';

type Values = { phone: string };

type RefinedData = {
  notAlreadyRegistered: LegacyStudentRow[];
  alreadyRegistered: LegacyStudentRow[];
};

export function LegacyPhoneSearchPage() {
  const router = useRouter();
  const title = useFormattedMessage<string>(messages.title);
  const subtitle = useFormattedMessage<string>(messages.subtitle);

  const phoneNumberLabel = useFormattedMessage<string>(messages.phoneNumberLabel);
  const phoneNumberLengthError = useFormattedMessage<string>(messages.phoneNumberLengthError);

  const schema = useMemo(
    () =>
      Yup.object({
        phone: Yup.string().trim().length(11, phoneNumberLengthError),
      }),
    [phoneNumberLengthError],
  );

  const { values, handleChange, touched, errors } = useFormik<Values>({
    initialValues: { phone: '' },
    validationSchema: schema,
    onSubmit: console.log,
    validateOnMount: true,
  });

  const { refetch, ...admissionSearchQuery } = useAdmissionsControllerSearchLegacy(
    {
      query: values.phone.trim(),
    },
    {
      query: {
        enabled: false,
      },
    },
  );

  const refetchAdmissions = useCallback(() => {
    refetch();
  }, []);

  const debouncedAdmissionsFetch = useRef<ReturnType<typeof debounce> | null>(null);

  useEffect(() => {
    debouncedAdmissionsFetch.current = debounce(refetchAdmissions, 500);
    return () => {
      debouncedAdmissionsFetch.current?.clear();
    };
  }, [refetchAdmissions]);

  useEffect(() => {
    if (values.phone.trim() && schema.isValidSync(values)) {
      debouncedAdmissionsFetch.current?.();
    }
  }, [schema, values]);

  const alertConfigs = useMemo<{
    severity: AlertColor;
    message: { id: string; defaultMessage: string };
  } | null>(() => {
    if (admissionSearchQuery.isSuccess && admissionSearchQuery.data?.data?.length) {
      return { severity: 'success', message: messages.phoneNumberSearchSuccessHeading };
    }
    if (admissionSearchQuery.isSuccess && !admissionSearchQuery.data?.data?.length) {
      return { severity: 'warning', message: messages.phoneNumberSearchNoData };
    }
    if (admissionSearchQuery.isError) {
      return { severity: 'error', message: messages.phoneNumberSearchError };
    }
    return null;
  }, [admissionSearchQuery.isError, admissionSearchQuery.isSuccess, admissionSearchQuery.data?.data?.length]);

  const onItemSelect = useCallback((row: Partial<LegacyStudentRow>) => {
    if (!row.grNumber || !row.phone) return;
    const lookupQuery = row.grNumber || row.phone;
    const token = encodeLegacyLookupToken(lookupQuery);
    router.push(`/admissions/application?legacy=${encodeURIComponent(token)}`);
  }, [router]);

  const refinedData: RefinedData = useMemo<RefinedData>(() => {
    if (!admissionSearchQuery.data?.data) return { notAlreadyRegistered: [], alreadyRegistered: [] };
    return admissionSearchQuery.data.data.reduce<RefinedData>((acc: RefinedData, row: LegacyStudentRow) => {
      if (row.alreadyRegistered) {
        acc.alreadyRegistered.push(row);
      } else {
        acc.notAlreadyRegistered.push(row);
      }
      return acc;
    }, { notAlreadyRegistered: [], alreadyRegistered: [] });
  }, [admissionSearchQuery.data?.data]);
  const { notAlreadyRegistered, alreadyRegistered } = refinedData;

  return (
    <PageContainer pageTitle={{ title: { text: title, language: 'ur' }, subtitle: { text: subtitle, language: 'ur' } }}>
      <Container maxWidth="md">
        <Box sx={{ backgroundColor: 'secondary.light', borderRadius: 2, width: '100%', p: 2 }}>
          <TextField
            fullWidth
            dir="rtl"
            name="phone"
            label={phoneNumberLabel}
            value={values.phone}
            onChange={handleChange}
            error={touched.phone && !!errors.phone}
            helperText={errors.phone}
            sx={{
              direction: 'rtl',
              '& .MuiOutlinedInput-root': {
                direction: 'rtl',
              },
              '& .MuiInputBase-input': {
                textAlign: 'right',
                direction: 'rtl',
                fontFamily: 'var(--font-mehr)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                textAlign: 'right',
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'var(--font-mehr)',
                left: 'auto',
                right: 30,
                transformOrigin: 'top right',
                textAlign: 'right',
              },
              '& .MuiInputLabel-shrink': {
                fontFamily: 'var(--font-mehr)',
                transformOrigin: 'top right',
              },
            }}
            slotProps={{
              input: {
                endAdornment: admissionSearchQuery.isFetching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={18} thickness={5} color="primary" />
                  </InputAdornment>
                ) : undefined,
              },
              formHelperText: {
                sx: {
                  fontFamily: 'var(--font-mehr)',
                  textAlign: 'right',
                  mt: 2,
                  fontSize: 14,
                  color: 'error.main',
                },
              },
              htmlInput: {
                autoComplete: 'tel',
              },
            }}
          />
        </Box>
        {alertConfigs ? (
          <Alert
            severity={alertConfigs.severity}
            sx={{ my: 2, direction: 'rtl', gap: 1 }}
            icon={
              alertConfigs.severity === 'success' ? (
                <CheckCircleOutlined />
              ) : alertConfigs.severity === 'warning' ? (
                <WarningOutlined />
              ) : alertConfigs.severity === 'error' ? (
                <ErrorOutlined />
              ) : (
                <InfoOutlined />
              )
            }
          >
            <FormattedMessage message={alertConfigs.message} language="ur" />
          </Alert>
        ) : null}
        {admissionSearchQuery.isSuccess && notAlreadyRegistered?.length ? (
          <List sx={{ direction: 'rtl' }}>
            {notAlreadyRegistered.map((row) => (
              <StudentListItem key={row.id} row={row} onItemSelect={onItemSelect} />
            ))}
          </List>
        ) : null}
        {admissionSearchQuery.isSuccess && alreadyRegistered?.length ? (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ direction: 'rtl', textAlign: 'right', fontFamily: 'var(--font-mehr)', gap: 1 }}
            icon={<CheckCircleOutlined />}
            >
              <FormattedMessage message={messages.alreadyRegisteredHeading} language="ur" />
            </Alert>
            <List sx={{ direction: 'rtl' }}>
              {alreadyRegistered.map((row) => (
                <StudentListItem key={row.grNumber} row={row} success />
              ))}
            </List>
          </Box>
        ) : null}
      </Container>
    </PageContainer>
  );
}
