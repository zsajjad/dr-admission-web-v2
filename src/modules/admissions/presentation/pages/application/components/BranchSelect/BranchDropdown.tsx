'use client';

import { useBranchControllerFindAll } from '@/providers/service/branch/branch';

import { RtlSelectField } from '@/theme/Form';

type SelectOnChange = NonNullable<React.ComponentProps<typeof RtlSelectField>['onChange']>;

export interface BranchDropdownProps {
  name: string;
  value: string;
  onChange: SelectOnChange;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  label: string;
  loadingText: string;
  emptyText: string;
}

export function BranchDropdown({
  name,
  value,
  onChange,
  onBlur,
  disabled,
  error,
  helperText,
  label,
  loadingText,
  emptyText,
}: BranchDropdownProps) {
  const branchesQuery = useBranchControllerFindAll(
    { take: 100, sortBy: 'name', sortOrder: 'asc', includeInActive: false },
    { query: { staleTime: 5 * 60 * 1000 } },
  );

  const options =
    branchesQuery.isLoading || branchesQuery.isFetching
      ? [{ value: '', label: loadingText, disabled: true }]
      : branchesQuery.data?.data?.length
        ? branchesQuery.data.data.map((b) => ({ value: b.id, label: b.name }))
        : [{ value: '', label: emptyText, disabled: true }];

  return (
    <RtlSelectField
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      error={error}
      helperText={helperText}
      options={options}
    />
  );
}
