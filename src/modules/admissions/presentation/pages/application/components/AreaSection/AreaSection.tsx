'use client';

import { useEffect, useMemo } from 'react';

import { Stack } from '@mui/material';

import { useFormikContext } from 'formik';

import { SectionCard } from '@/theme/SectionCard';

import type { AdmissionFormValues } from '../../admissionFormSchema';
import messages from '../../messages';

import { TextField } from '../TextField';
import { VanSelect } from '../VanSelect';

import { AreaSelect } from './AreaSelect';
import { useAreaHasVan } from './useSelectedArea';

export function AreaSection() {
  const formik = useFormikContext<AdmissionFormValues>();
  const { values, setFieldValue } = formik;

  const areaHasVan = useAreaHasVan(values.branchId || undefined, values.areaId || undefined);

  const computedCanShowVanSelect = useMemo(() => {
    const gender = values.gender;
    if (gender !== 'MALE' && gender !== 'FEMALE') return false;
    return areaHasVan[gender];
  }, [areaHasVan, values.gender]);

  // If selected area doesn't have van for the selected gender, force value to false and keep it out of the UI.
  useEffect(() => {
    if (!computedCanShowVanSelect && values.vanRequired !== false) {
      void setFieldValue('vanRequired', false);
    }
  }, [computedCanShowVanSelect, setFieldValue, values.vanRequired]);

  return (
    <SectionCard titleMessage={messages.sectionAddress} descriptionMessage={messages.sectionAddressDesc}>
      <Stack spacing={2}>
        <AreaSelect
          labelMessage={messages.labelArea}
          loadingMessage={messages.dropdownLoading}
          emptyMessage={messages.dropdownEmpty}
          selectBranchFirstMessage={messages.selectBranchFirst}
        />
        <TextField name="addressLine" labelMessage={messages.labelAddress} multiline minRows={3} inputDir="ltr" />
        {computedCanShowVanSelect ? (
          <Stack spacing={1} sx={{ direction: 'rtl' }}>
            <VanSelect labelMessage={messages.labelVanRequired} />
          </Stack>
        ) : null}
      </Stack>
    </SectionCard>
  );
}
