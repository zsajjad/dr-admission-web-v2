'use client';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { Box, Button } from '@mui/material';

import { useFormikContext } from 'formik';

import { useFormattedMessage } from '@/theme/FormattedMessage';
import { Typography } from '@/theme/Typography';

import type { AdmissionFormValues } from '../admissionFormSchema';
import messages from '../messages';

export function VanSelect({
  labelMessage,
  fieldName = 'vanRequired',
}: {
  labelMessage: MessageDescriptor;
  yesText?: string;
  noText?: string;
  fieldName?: keyof Pick<AdmissionFormValues, 'vanRequired'>;
}) {
  const intl = useIntl();
  const formik = useFormikContext<AdmissionFormValues>();

  const yesText = useFormattedMessage<string>(messages.yes);
  const noText = useFormattedMessage<string>(messages.no);

  const value = formik.values[fieldName];
  const error = formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <Box sx={{ direction: 'rtl' }}>
      <Box
        id={String(fieldName)}
        data-field={String(fieldName)}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl' }}
      >
        <Typography language="ur" variant="body1" sx={{ fontWeight: 600 }}>
          {intl.formatMessage(labelMessage)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            type="button"
            variant={value === true ? 'contained' : 'outlined'}
            onClick={() => {
              void formik.setFieldValue(fieldName, true);
              void formik.setFieldTouched(fieldName, true, true);
            }}
            sx={{ fontFamily: 'var(--font-mehr)', minWidth: 80 }}
          >
            {yesText}
          </Button>
          <Button
            type="button"
            variant={value === false ? 'contained' : 'outlined'}
            onClick={() => {
              void formik.setFieldValue(fieldName, false);
              void formik.setFieldTouched(fieldName, true, true);
            }}
            sx={{ fontFamily: 'var(--font-mehr)', minWidth: 80 }}
          >
            {noText}
          </Button>
        </Box>
      </Box>

      {error ? (
        <Typography language="ur" variant="body2" color="error.main" sx={{ textAlign: 'right', mt: 1 }}>
          {error as string}
        </Typography>
      ) : (
        <Box sx={{ height: 18, mt: 1 }} />
      )}
    </Box>
  );
}
