'use client';

import type { MessageDescriptor } from 'react-intl';

import { FormControl, FormControlLabel, FormHelperText, Switch, type SwitchProps } from '@mui/material';

import { useField } from 'formik';

import { FormattedMessage } from '@/theme/FormattedMessage';

export type SwitchFieldProps = Omit<SwitchProps, 'name' | 'checked' | 'onChange'> & {
  name: string;
  labelMessage: MessageDescriptor;
};

export function SwitchField({ name, labelMessage, disabled, ...props }: SwitchFieldProps) {
  const [field, meta, helpers] = useField<boolean>(name);

  const showError = !!(meta.touched && meta.error);
  const helperText = ((meta.touched && meta.error ? meta.error : ' ') as string) ?? ' ';

  return (
    <FormControl error={showError} sx={{ direction: 'rtl' }}>
      <FormControlLabel
        sx={{ mr: 0, ml: 0, justifyContent: 'space-between' }}
        label={<FormattedMessage message={labelMessage} language="ur" />}
        labelPlacement="start"
        control={
          <Switch
            {...props}
            name={name}
            checked={!!field.value}
            disabled={disabled}
            onBlur={field.onBlur}
            onChange={(_, checked) => helpers.setValue(checked)}
          />
        }
      />
      <FormHelperText sx={{ textAlign: 'right' }}>{helperText}</FormHelperText>
    </FormControl>
  );
}
