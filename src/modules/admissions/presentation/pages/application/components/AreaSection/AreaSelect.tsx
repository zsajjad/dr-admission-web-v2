'use client';

import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

import { useFormikContext } from 'formik';

import type { AdmissionFormValues } from '../../admissionFormSchema';

import { AreaDropdown } from './AreaDropdown';

export function AreaSelect({
  labelMessage,
  loadingMessage,
  emptyMessage,
  selectBranchFirstMessage,
}: {
  labelMessage: MessageDescriptor;
  loadingMessage: MessageDescriptor;
  emptyMessage: MessageDescriptor;
  selectBranchFirstMessage: MessageDescriptor;
}) {
  const intl = useIntl();
  const formik = useFormikContext<AdmissionFormValues>();

  const error = !!(formik.touched.areaId && formik.errors.areaId);
  const helperText = ((formik.touched.areaId && formik.errors.areaId) || ' ') as string;

  const onChange: NonNullable<React.ComponentProps<typeof AreaDropdown>['onChange']> = (e) => {
    const nextAreaId = String((e.target as { value?: unknown }).value ?? '');
    void formik.setFieldValue('areaId', nextAreaId);
  };

  return (
    <AreaDropdown
      name="areaId"
      value={formik.values.areaId}
      onChange={onChange}
      onBlur={formik.handleBlur}
      branchId={formik.values.branchId || undefined}
      error={error}
      label={intl.formatMessage(labelMessage)}
      loadingText={intl.formatMessage(loadingMessage)}
      emptyText={intl.formatMessage(emptyMessage)}
      selectBranchFirstText={intl.formatMessage(selectBranchFirstMessage)}
    />
  );
}
