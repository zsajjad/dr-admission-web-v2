'use client';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { useFormikContext } from 'formik';

import type { AdmissionFormValues } from '../../admissionFormSchema';

import { BranchDropdown } from './BranchDropdown';

export function BranchSelect({
  disabled,
  labelMessage,
  loadingMessage,
  emptyMessage,
}: {
  disabled?: boolean;
  labelMessage: MessageDescriptor;
  loadingMessage: MessageDescriptor;
  emptyMessage: MessageDescriptor;
}) {
  const intl = useIntl();
  const formik = useFormikContext<AdmissionFormValues>();

  const error = !!(formik.touched.branchId && formik.errors.branchId);
  const helperText = ((formik.touched.branchId && formik.errors.branchId) || ' ') as string;

  const onChange: NonNullable<React.ComponentProps<typeof BranchDropdown>['onChange']> = (e) => {
    const nextBranchId = String((e.target as { value?: unknown }).value ?? '');
    void formik.setFieldValue('branchId', nextBranchId);
    void formik.setFieldValue('areaId', '');
  };

  return (
    <BranchDropdown
      name="branchId"
      value={formik.values.branchId}
      onChange={onChange}
      onBlur={formik.handleBlur}
      disabled={disabled}
      error={error}
      helperText={helperText}
      label={intl.formatMessage(labelMessage)}
      loadingText={intl.formatMessage(loadingMessage)}
      emptyText={intl.formatMessage(emptyMessage)}
    />
  );
}
