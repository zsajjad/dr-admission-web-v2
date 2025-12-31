import { memoize } from 'lodash';

import { Box, ListItemButton } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';

interface StudentListItemRow {
  id: string;
  name?: string;
  fatherName?: string;
  grNumber?: string;
  gender?: string;
}

interface StudentListItemProps {
  row: StudentListItemRow;
  success?: boolean;
  onItemSelect?: (row: StudentListItemRow) => void;
}

const getRelationPart = memoize((gender: string) => {
  const relation = gender?.toLowerCase().includes('female')
    ? 'd/o'
    : gender?.toLowerCase().includes('male')
      ? 's/o'
      : '';
  return relation;
});

export function StudentListItem({ row, success, onItemSelect }: StudentListItemProps) {
  const relation = getRelationPart(row.gender!);
  const relationPart =
    row.fatherName && relation ? `${relation} ${row.fatherName}` : row.fatherName ? row.fatherName : '';

  return (
    <ListItemButton
      key={row.id}
      onClick={() => onItemSelect?.(row)}
      sx={{
        gap: 1,
        direction: 'ltr',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderRadius: 2,
        p: 2,
        mb: 2,
        cursor: 'pointer',
        backgroundColor: success ? 'rgb(229, 246, 253)' : 'background.paper',
        '&:hover': {
          backgroundColor: success ? 'rgb(229, 246, 253)' : 'background.paper',
          cursor: success ? 'default' : 'pointer',
        },
      }}
    >
      <Box
        sx={{
          flexDirection: 'row',
          gap: 1,
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <FormattedMessage
          message={messages.grNumber}
          values={{ grNumber: row.grNumber }}
          language="en"
          sx={{ fontWeight: 700, textAlign: 'left', fontSize: 12 }}
        />

        <FormattedMessage
          message={messages.gender}
          values={{ gender: row.gender }}
          sx={{ fontWeight: 700, textAlign: 'left', fontSize: 12 }}
        />
      </Box>
      <FormattedMessage message={messages.name} values={{ name: row.name, relationPart }} language="en" />
    </ListItemButton>
  );
}
