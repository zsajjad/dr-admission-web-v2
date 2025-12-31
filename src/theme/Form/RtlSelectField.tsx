'use client';

import { MenuItem, type TextFieldProps } from '@mui/material';

import { RtlTextField } from './RtlTextField';

export type RtlSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RtlSelectFieldProps = Omit<TextFieldProps, 'select' | 'children' | 'onChange'> & {
  options: RtlSelectOption[];
  onChange?: NonNullable<TextFieldProps['SelectProps']>['onChange'];
};

export function RtlSelectField({ options, SelectProps, slotProps, onChange, ...props }: RtlSelectFieldProps) {
  return (
    <RtlTextField
      {...props}
      select
      inputDir="rtl"
      SelectProps={{
        ...SelectProps,
        onChange,
        MenuProps: {
          ...SelectProps?.MenuProps,
          PaperProps: {
            ...SelectProps?.MenuProps?.PaperProps,
            sx: {
              direction: 'rtl',
              '& .MuiMenuItem-root': {
                fontFamily: 'var(--font-mehr)',
                textAlign: 'right',
              },
              ...SelectProps?.MenuProps?.PaperProps?.sx,
            },
          },
        },
      }}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...(slotProps as TextFieldProps['slotProps'])?.htmlInput,
          dir: 'rtl',
        },
      }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </MenuItem>
      ))}
    </RtlTextField>
  );
}
