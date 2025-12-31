'use client';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { useField } from 'formik';

import { RtlSelectField } from '@/theme/Form';

export function GenderSelect({
  name,
  labelMessage,
  placeholderMessage,
  maleMessage,
  femaleMessage,
  disabled,
}: {
  name: string;
  labelMessage: MessageDescriptor;
  placeholderMessage: MessageDescriptor;
  maleMessage: MessageDescriptor;
  femaleMessage: MessageDescriptor;
  disabled?: boolean;
}) {
  const intl = useIntl();
  const [field, meta] = useField<string>(name);

  const showError = !!(meta.touched && meta.error);
  const helperText = (meta.touched && meta.error ? meta.error : ' ') as string;

  return (
    <RtlSelectField
      name={name}
      id={name}
      label={intl.formatMessage(labelMessage)}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      disabled={disabled}
      error={showError}
      helperText={helperText}
      options={[
        { value: '', label: intl.formatMessage(placeholderMessage), disabled: true },
        { value: 'MALE', label: intl.formatMessage(maleMessage) },
        { value: 'FEMALE', label: intl.formatMessage(femaleMessage) },
      ]}
    />
  );
}
