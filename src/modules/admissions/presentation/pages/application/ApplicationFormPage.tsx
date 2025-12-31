'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useFormik } from 'formik';

import { config } from '@/config';
import { decodeLegacyLookupToken } from '@/modules/admissions/utils/legacyLookupToken';
import { searchLegacyAdmissions } from '@/modules/admissions/infrastructure/legacy/legacySearchRepository';
import { useCreateAdmission } from '@/modules/admissions/infrastructure/admissions/useCreateAdmission';
import { useAreas } from '@/modules/admissions/infrastructure/referenceData/useAreas';
import { useBranches } from '@/modules/admissions/infrastructure/referenceData/useBranches';
import { PageContainer } from '@/modules/admissions/presentation/components/PageContainer';
import {
  AdmissionFormValues,
  getAdmissionFormSchema,
} from '@/modules/admissions/presentation/pages/application/admissionFormSchema';
import { useMutation } from '@tanstack/react-query';

function toDateOnly(value: string | undefined | null): string {
  if (!value) return '';
  // Accept already-ISO-date or ISO datetime; keep yyyy-mm-dd
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? '';
}

export function ApplicationFormPage() {
  const searchParams = useSearchParams();
  const legacyToken = searchParams.get('legacy');

  const decodedLegacy = useMemo(() => (legacyToken ? decodeLegacyLookupToken(legacyToken) : null), [legacyToken]);
  const isLegacyPrefill = !!decodedLegacy;

  const branchesQuery = useBranches();
  const createAdmission = useCreateAdmission();

  const [prefill, setPrefill] = useState<Partial<AdmissionFormValues> | null>(null);
  const legacyPrefillMutation = useMutation({
    mutationFn: async (query: string) => searchLegacyAdmissions(query),
  });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!decodedLegacy?.query) return;
      const res = await legacyPrefillMutation.mutateAsync(decodedLegacy.query);
      const row = res.data?.[0];
      if (!row || cancelled) return;
      setPrefill(row.prefill);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [decodedLegacy?.query]);

  const initialValues: AdmissionFormValues = useMemo(
    () => ({
      branchId: prefill?.branchId ?? '',
      areaId: prefill?.areaId ?? '',

      name: prefill?.name ?? '',
      fatherName: prefill?.fatherName ?? '',
      dateOfBirth: toDateOnly(prefill?.dateOfBirth) ?? '',
      gender: (prefill?.gender as AdmissionFormValues['gender']) ?? '',
      identityNumber: prefill?.identityNumber ?? '',

      phone: prefill?.phone ?? '',
      alternatePhone: '',

      addressLine: prefill?.addressLine ?? '',
      localityOrCity: prefill?.localityOrCity ?? '',

      schoolName: prefill?.schoolName ?? '',
      lastYearClass: prefill?.lastYearClass ?? '',

      vanRequired: prefill?.vanRequired ?? null,

      identityProofFile: null,
      studentPhotoFile: null,
    }),
    [prefill],
  );

  const schema = useMemo(() => getAdmissionFormSchema({ isLegacyPrefill }), [isLegacyPrefill]);

  const sessionId = config.ADMISSIONS_ACTIVE_SESSION_ID;
  const missingSessionId = !sessionId;
  const formik = useFormik<AdmissionFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);

      // Upload integration is pending; for now, block submission if files are attached (or required).
      if (values.identityProofFile || values.studentPhotoFile) {
        helpers.setStatus('Document upload is not wired yet. Please remove files and try again (or implement upload).');
        return;
      }

      if (missingSessionId) {
        helpers.setStatus('Missing active session configuration.');
        return;
      }

      try {
        await createAdmission.mutateAsync({
          data: {
            sessionId,
            legacyStudentId: undefined,
            branchId: values.branchId,
            areaId: values.areaId,
            name: values.name.trim(),
            fatherName: values.fatherName.trim(),
            dateOfBirth: values.dateOfBirth,
            gender: values.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
            phone: values.phone.trim(),
            alternatePhone: values.alternatePhone.trim() || undefined,
            address: [values.addressLine.trim(), values.localityOrCity.trim()].filter(Boolean).join('\n') || undefined,
            identityNumber: values.identityNumber.trim() || undefined,
            schoolName: values.schoolName.trim() || undefined,
            lastYearClass: values.lastYearClass.trim() || undefined,
            vanRequired: values.vanRequired ?? undefined,
          },
        });
        helpers.setStatus('Submitted successfully (success page coming next).');
      } catch {
        helpers.setStatus('Submission failed. Please try again.');
      }
    },
  });

  const areasQuery = useAreas(formik.values.branchId || undefined);
  const disableLegacyFields = isLegacyPrefill && !!prefill;

  const handleBranchChange = (e: SelectChangeEvent) => {
    const nextBranchId = e.target.value;
    void formik.setFieldValue('branchId', nextBranchId);
    void formik.setFieldValue('areaId', '');
  };

  return (
    <PageContainer
      title="Admission Application"
      subtitle={
        isLegacyPrefill
          ? 'Your previous record will be used to pre-fill the form. Some fields are locked.'
          : 'Fill out the form below to submit an admission application.'
      }
    >
      <Stack spacing={2}>
        {missingSessionId ? (
          <Alert severity="error">
            Missing configuration: set <code>NEXT_PUBLIC_ADMISSIONS_ACTIVE_SESSION_ID</code> to enable submissions.
          </Alert>
        ) : null}

        {legacyPrefillMutation.isPending ? <Alert severity="info">Loading legacy data…</Alert> : null}
        {legacyPrefillMutation.isError ? (
          <Alert severity="warning">
            Unable to load legacy data. You can still proceed by filling the form manually.
          </Alert>
        ) : null}

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            {formik.status ? <Alert severity="info">{formik.status}</Alert> : null}
            {createAdmission.isError ? <Alert severity="error">Unable to submit. Please retry.</Alert> : null}

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Branch & Location
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <FormControl fullWidth error={formik.touched.branchId && !!formik.errors.branchId}>
                    <InputLabel id="branchId-label">Branch</InputLabel>
                    <Select
                      labelId="branchId-label"
                      name="branchId"
                      label="Branch"
                      value={formik.values.branchId}
                      onChange={handleBranchChange}
                      disabled={disableLegacyFields}
                    >
                      {(branchesQuery.data?.data ?? []).map((b) => (
                        <MenuItem key={b.id} value={b.id}>
                          {b.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{(formik.touched.branchId && formik.errors.branchId) || ' '}</FormHelperText>
                  </FormControl>

                  <FormControl
                    fullWidth
                    error={formik.touched.areaId && !!formik.errors.areaId}
                    disabled={!formik.values.branchId}
                  >
                    <InputLabel id="areaId-label">Area</InputLabel>
                    <Select
                      labelId="areaId-label"
                      name="areaId"
                      label="Area"
                      value={formik.values.areaId}
                      onChange={formik.handleChange}
                    >
                      {(areasQuery.data?.data ?? []).map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                          {a.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{(formik.touched.areaId && formik.errors.areaId) || ' '}</FormHelperText>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Personal Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Student Full Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && !!formik.errors.name}
                    helperText={(formik.touched.name && formik.errors.name) || ' '}
                  />
                  <TextField
                    fullWidth
                    name="fatherName"
                    label="Father/Guardian Name"
                    value={formik.values.fatherName}
                    onChange={formik.handleChange}
                    error={formik.touched.fatherName && !!formik.errors.fatherName}
                    helperText={(formik.touched.fatherName && formik.errors.fatherName) || ' '}
                  />

                  <TextField
                    fullWidth
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    error={formik.touched.dateOfBirth && !!formik.errors.dateOfBirth}
                    helperText={(formik.touched.dateOfBirth && formik.errors.dateOfBirth) || ' '}
                    InputLabelProps={{ shrink: true }}
                    disabled={disableLegacyFields}
                  />

                  <FormControl
                    fullWidth
                    error={formik.touched.gender && !!formik.errors.gender}
                    disabled={disableLegacyFields}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      name="gender"
                      label="Gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                    </Select>
                    <FormHelperText>
                      {(formik.touched.gender && (formik.errors.gender as string)) || ' '}
                    </FormHelperText>
                  </FormControl>

                  <TextField
                    fullWidth
                    name="identityNumber"
                    label="B-Form/CNIC Number (recommended)"
                    value={formik.values.identityNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.identityNumber && !!formik.errors.identityNumber}
                    helperText={(formik.touched.identityNumber && (formik.errors.identityNumber as string)) || ' '}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Contact Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && !!formik.errors.phone}
                    helperText={(formik.touched.phone && (formik.errors.phone as string)) || ' '}
                    disabled={disableLegacyFields}
                  />
                  <TextField
                    fullWidth
                    name="alternatePhone"
                    label="Alternate Phone (optional)"
                    value={formik.values.alternatePhone}
                    onChange={formik.handleChange}
                    error={formik.touched.alternatePhone && !!formik.errors.alternatePhone}
                    helperText={(formik.touched.alternatePhone && (formik.errors.alternatePhone as string)) || ' '}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Address
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    name="addressLine"
                    label="Address"
                    multiline
                    minRows={3}
                    value={formik.values.addressLine}
                    onChange={formik.handleChange}
                    error={formik.touched.addressLine && !!formik.errors.addressLine}
                    helperText={(formik.touched.addressLine && (formik.errors.addressLine as string)) || ' '}
                  />
                  <TextField
                    fullWidth
                    name="localityOrCity"
                    label="Locality/City (optional)"
                    value={formik.values.localityOrCity}
                    onChange={formik.handleChange}
                    error={formik.touched.localityOrCity && !!formik.errors.localityOrCity}
                    helperText={(formik.touched.localityOrCity && (formik.errors.localityOrCity as string)) || ' '}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Education
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    name="schoolName"
                    label="School Name"
                    value={formik.values.schoolName}
                    onChange={formik.handleChange}
                    error={formik.touched.schoolName && !!formik.errors.schoolName}
                    helperText={(formik.touched.schoolName && (formik.errors.schoolName as string)) || ' '}
                  />
                  <TextField
                    fullWidth
                    name="lastYearClass"
                    label="Last Year Class (optional)"
                    value={formik.values.lastYearClass}
                    onChange={formik.handleChange}
                    error={formik.touched.lastYearClass && !!formik.errors.lastYearClass}
                    helperText={(formik.touched.lastYearClass && (formik.errors.lastYearClass as string)) || ' '}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Additional Flags
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Van Required</Typography>
                    <Switch
                      checked={formik.values.vanRequired === true}
                      onChange={(e) => void formik.setFieldValue('vanRequired', e.target.checked)}
                      inputProps={{ 'aria-label': 'Van Required' }}
                    />
                  </Box>
                  {formik.touched.vanRequired && formik.errors.vanRequired ? (
                    <FormHelperText error>{formik.errors.vanRequired as string}</FormHelperText>
                  ) : (
                    <FormHelperText> </FormHelperText>
                  )}
                  {formik.values.vanRequired ? (
                    <Alert severity="info">
                      Van Stop selection is not implemented yet (backend endpoints not generated in this repo).
                    </Alert>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Documents
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <FormControl error={formik.touched.identityProofFile && !!formik.errors.identityProofFile}>
                    <FormControlLabel
                      control={
                        <Button variant="outlined" component="label">
                          Upload Identity Proof
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              void formik.setFieldValue('identityProofFile', e.currentTarget.files?.[0] ?? null)
                            }
                          />
                        </Button>
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          {formik.values.identityProofFile
                            ? formik.values.identityProofFile.name
                            : isLegacyPrefill
                              ? 'On record'
                              : 'Required'}
                        </Typography>
                      }
                    />
                    <FormHelperText>
                      {(formik.touched.identityProofFile && (formik.errors.identityProofFile as string)) || ' '}
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormControlLabel
                      control={
                        <Button variant="outlined" component="label">
                          Upload Student Photo (optional)
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              void formik.setFieldValue('studentPhotoFile', e.currentTarget.files?.[0] ?? null)
                            }
                          />
                        </Button>
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          {formik.values.studentPhotoFile ? formik.values.studentPhotoFile.name : 'Optional'}
                        </Typography>
                      }
                    />
                  </FormControl>

                  <Alert severity="warning">
                    Document upload is not wired yet (needs asset upload endpoint/spec). Files will block submission for
                    now.
                  </Alert>
                </Stack>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting || createAdmission.isPending || missingSessionId}
                >
                  Submit Application
                </Button>
                <Box sx={{ flex: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Fields must be English-only where applicable.
                </Typography>
              </CardActions>
            </Card>
          </Stack>
        </form>
      </Stack>
    </PageContainer>
  );
}
