'use client';

import { useAreaControllerFindAll } from '@/providers/service/area/area';

import { RtlSelectField } from '@/theme/Form';

type SelectOnChange = NonNullable<React.ComponentProps<typeof RtlSelectField>['onChange']>;

export interface AreaDropdownProps {
  name: string;
  value: string;
  onChange: SelectOnChange;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  branchId?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  label: string;
  loadingText: string;
  emptyText: string;
  selectBranchFirstText: string;
}

export function AreaDropdown({
  name,
  value,
  onChange,
  onBlur,
  branchId,
  disabled,
  error,
  helperText,
  label,
  loadingText,
  emptyText,
  selectBranchFirstText,
}: AreaDropdownProps) {
  const areasQuery = useAreaControllerFindAll(
    branchId ? { branchId, take: 100, sortBy: 'name', sortOrder: 'asc', includeInActive: false } : undefined,
    { query: { enabled: !!branchId, staleTime: 5 * 60 * 1000 } },
  );

  const options = !branchId
    ? [{ value: '', label: selectBranchFirstText, disabled: true }]
    : areasQuery.isLoading || areasQuery.isFetching
      ? [{ value: '', label: loadingText, disabled: true }]
      : areasQuery.data?.data?.length
        ? areasQuery.data.data.map((a) => ({ value: a.id, label: a.name }))
        : [{ value: '', label: emptyText, disabled: true }];

  return (
    <RtlSelectField
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled || !branchId}
      error={error}
      helperText={helperText}
      options={options}
    />
  );
}
