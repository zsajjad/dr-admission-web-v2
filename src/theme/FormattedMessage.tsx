'use client';

import { ReactNode } from 'react';

import { MessageDescriptor, useIntl, PrimitiveType } from 'react-intl';

import { Typography, TypographyProps } from './Typography';

type Values = Record<string, ReactNode | PrimitiveType>;

interface NumberFormatOptions {
  numberingSystem?:
    | 'arab'
    | 'latn'
    | 'deva'
    | 'fullwide'
    | 'hanidec'
    | 'mathsans'
    | 'mathbold'
    | 'mong'
    | 'mymr'
    | 'orya'
    | 'tamldec'
    | 'thai'
    | 'tibt';
  minimumIntegerDigits?: number;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

/**
 * Hook for formatting a single message using react-intl
 *
 * @param message - The message descriptor to format
 * @param values - Optional values to interpolate into the message
 * @param formatNumbers - Whether to format numbers with the current locale's numeral system
 * @param numberFormatOptions - Options for number formatting
 * @returns The formatted message
 */
export function useFormattedMessage<T extends string | ReactNode[]>(
  message: MessageDescriptor,
  values?: Values,
  formatNumbers?: boolean,
  numberFormatOptions?: NumberFormatOptions,
): T {
  const intl = useIntl();

  if (formatNumbers && values) {
    const formattedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (typeof value === 'number') {
          return [key, intl.formatNumber(value, numberFormatOptions)];
        }
        return [key, value];
      }),
    );
    return intl.formatMessage(message, formattedValues) as T;
  }

  return intl.formatMessage(message, values) as T;
}

export interface FormattedMessageProps extends Omit<TypographyProps, 'children'> {
  message: MessageDescriptor;
  values?: Values;
  formatNumbers?: boolean;
  numberFormatOptions?: NumberFormatOptions;
}

export function FormattedMessage({
  message,
  values,
  formatNumbers,
  numberFormatOptions,
  ...props
}: FormattedMessageProps) {
  const formattedMessage = useFormattedMessage(message, values, formatNumbers, numberFormatOptions);
  return <Typography {...props}>{formattedMessage}</Typography>;
}
