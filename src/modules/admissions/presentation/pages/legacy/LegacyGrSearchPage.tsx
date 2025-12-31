'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Alert, Button, Card, CardActions, CardContent, Stack, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { encodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';
import { searchLegacyAdmissions } from '@/modules/admissions/infrastructure/legacy/legacySearchRepository';
import { PageContainer } from '@/modules/admissions/presentation/components/PageContainer';
import { useMutation } from '@tanstack/react-query';

type Values = { grNumber: string };

export function LegacyGrSearchPage() {
  const router = useRouter();
  const schema = useMemo(
    () =>
      Yup.object({
        grNumber: Yup.string().trim().required('GR number is required'),
      }),
    [],
  );

  const searchMutation = useMutation({
    mutationFn: async (query: string) => searchLegacyAdmissions(query),
  });

  return (
    <PageContainer title="Enter GR Number" subtitle="Enter your GR number to search your previous record.">
      <Formik<Values>
        initialValues={{ grNumber: '' }}
        validationSchema={schema}
        onSubmit={async (values) => {
          const result = await searchMutation.mutateAsync(values.grNumber);
          if (!result.data?.length) return;
          const token = encodeLegacyLookupToken(values.grNumber);
          router.push(`/admissions/application?legacy=${encodeURIComponent(token)}`);
        }}
      >
        {({ values, handleChange, touched, errors, isSubmitting }) => (
          <Form>
            <Stack spacing={2}>
              <Card variant="outlined">
                <CardContent>
                  <TextField
                    fullWidth
                    name="grNumber"
                    label="GR Number"
                    value={values.grNumber}
                    onChange={handleChange}
                    error={touched.grNumber && !!errors.grNumber}
                    helperText={(touched.grNumber && errors.grNumber) || ' '}
                  />
                  {searchMutation.isError ? (
                    <Alert severity="error">Unable to search legacy records. Please try again.</Alert>
                  ) : null}
                  {searchMutation.isSuccess && !searchMutation.data?.data?.length ? (
                    <Alert severity="warning">No records found for this GR number.</Alert>
                  ) : null}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting || searchMutation.isPending}>
                    Search
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
}
