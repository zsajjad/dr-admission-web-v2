'use client';

import type { MessageDescriptor } from 'react-intl';

import { TextField } from './TextField';

const DOB_MIN = '2001-01-01';
const DOB_MAX = '2020-12-31';

export type DateOfBirthFieldProps = {
  name?: string;
  labelMessage: MessageDescriptor;
};

export function DateOfBirthField({ name = 'dateOfBirth', labelMessage }: DateOfBirthFieldProps) {
  return (
    <TextField
      name={name}
      labelMessage={labelMessage}
      type="date"
      inputDir="ltr"
      slotProps={{
        inputLabel: { shrink: true },
        htmlInput: { min: DOB_MIN, max: DOB_MAX },
      }}
    />
  );
}
