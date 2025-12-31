'use client';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { useField } from 'formik';

import { RtlTextField, type RtlTextFieldProps } from '@/theme/Form';

export type TextFieldProps = Omit<RtlTextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'label'> & {
  name: string;
  labelMessage: MessageDescriptor;
};

export function TextField({ name, labelMessage, helperText, ...props }: TextFieldProps) {
  const intl = useIntl();
  const [field, meta] = useField<string>(name);

  const showError = !!(meta.touched && meta.error);
  const finalHelperText = helperText ?? ((meta.touched && meta.error ? meta.error : ' ') as string);

  return (
    <RtlTextField
      {...props}
      {...field}
      name={name}
      id={name}
      label={intl.formatMessage(labelMessage)}
      error={showError}
      helperText={finalHelperText}
    />
  );
}
