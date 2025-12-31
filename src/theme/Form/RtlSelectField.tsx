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
  const typedSlotProps = slotProps as TextFieldProps['slotProps'] | undefined;

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
          ...typedSlotProps?.htmlInput,
          dir: 'rtl',
        },
        inputLabel: {
          // ...(typedSlotProps?.inputLabel as any),
          sx: {
            // ...(typedSlotProps?.inputLabel as any)?.sx,
            paddingRight: '10px',
          },
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
