'use client';

import { TextField, type TextFieldProps } from '@mui/material';

export type RtlTextFieldProps = TextFieldProps & {
  /**
   * Visual direction for the input value itself.
   * - Use `ltr` for English-only fields so typing feels natural.
   * - Labels/helper text stay RTL.
   */
  inputDir?: 'rtl' | 'ltr';
};

export function RtlTextField({ sx, slotProps, inputDir = 'rtl', ...props }: RtlTextFieldProps) {
  const isLtr = inputDir === 'ltr';

  return (
    <TextField
      fullWidth
      dir="rtl"
      sx={{
        direction: 'rtl',
        '& .MuiOutlinedInput-root': {
          direction: 'rtl',
        },
        '& .MuiInputBase-input': {
          textAlign: isLtr ? 'left' : 'right',
          direction: inputDir,
          fontFamily: isLtr ? 'var(--font-jakarta)' : 'var(--font-mehr)',
        },
        '& .MuiFormHelperText-root': {
          fontFamily: 'var(--font-mehr)',
          textAlign: 'right',
          marginTop: 1,
          fontSize: 14,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          textAlign: 'right',
        },
        '& .MuiInputLabel-root': {
          fontFamily: 'var(--font-mehr)',
          left: 'auto',
          right: 30,
          transformOrigin: 'top right',
          textAlign: 'right',
        },
        '& .MuiInputLabel-shrink': {
          fontFamily: 'var(--font-mehr)',
          transformOrigin: 'top right',
        },
        ...sx,
      }}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...slotProps?.htmlInput,
          dir: inputDir,
        },
      }}
      {...props}
    />
  );
}
