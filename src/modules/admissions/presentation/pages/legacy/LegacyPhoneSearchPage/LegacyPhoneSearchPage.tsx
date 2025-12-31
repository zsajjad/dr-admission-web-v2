'use client';

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
import * as Yup from 'yup';

import { PageContainer } from '@/theme/Page';
import { CheckCircleOutlined, WarningOutlined, ErrorOutlined, InfoOutlined } from '@mui/icons-material';

import { StudentListItem } from '@/modules/admissions/presentation/components/StudentListItem';

import messages from './messages';
import { FormattedMessage, useFormattedMessage } from '@/theme/FormattedMessage';
import { useAdmissionsControllerSearchLegacy } from '@/providers/service/admissions/admissions';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { LegacyStudentRow } from '@/providers/service/app.schemas';
import { encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';
import { useRouter } from 'next/navigation';

type Values = { phone: string };

export function LegacyPhoneSearchPage() {
  const router = useRouter();
  const title = useFormattedMessage(messages.title);
  const subtitle = useFormattedMessage(messages.subtitle);

  const phoneNumberLabel = useFormattedMessage(messages.phoneNumberLabel);
  const phoneNumberLengthError = useFormattedMessage(messages.phoneNumberLengthError);

  const schema = Yup.object({
    phone: Yup.string()
      .trim()
      .length(11, phoneNumberLengthError as string),
  });

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

  const debouncedAdmissionsFetch = useRef(debounce(refetchAdmissions, 500));

  useEffect(() => {
    if (values.phone.trim() && schema.isValidSync(values)) {
      debouncedAdmissionsFetch.current();
    }
  }, [values.phone, refetchAdmissions]);

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
  }, [admissionSearchQuery.isSuccess, admissionSearchQuery.data?.data?.length]);

  const onItemSelect = useCallback((row: LegacyStudentRow) => {
    if (!row.grNumber || !row.phone) return;
    const lookupQuery = row.grNumber || row.phone;
    const token = encodeLegacyLookupToken(lookupQuery);
    router.push(`/admissions/application?legacy=${encodeURIComponent(token)}`);
  }, []);

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
        {admissionSearchQuery.isSuccess && admissionSearchQuery.data?.data?.length ? (
          <List sx={{ direction: 'rtl' }}>
            {admissionSearchQuery.data?.data?.map((row) => (
              <StudentListItem
                key={row.id}
                row={{
                  ...row,
                  name: row.name ?? '',
                  gender: row.gender ?? '',
                  fatherName: row.fatherName ?? '',
                  grNumber: row.grNumber ?? '',
                }}
                onItemSelect={onItemSelect}
              />
            ))}
          </List>
        ) : null}
      </Container>
    </PageContainer>
  );
}
