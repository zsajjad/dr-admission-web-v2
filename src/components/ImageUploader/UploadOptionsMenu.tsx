'use client';

import React from 'react';

import { CameraAlt as CameraIcon, PhotoLibrary as GalleryIcon } from '@mui/icons-material';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';

import { useFormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';

interface UploadOptionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
}

const UploadOptionsMenu: React.FC<UploadOptionsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  onSelectGallery,
  onSelectCamera,
}) => {
  const menuTitle = useFormattedMessage<string>(messages.menuTitle);
  const selectFromGallery = useFormattedMessage<string>(messages.selectFromGallery);
  const selectFromGalleryHint = useFormattedMessage<string>(messages.selectFromGalleryHint);
  const takePhoto = useFormattedMessage<string>(messages.takePhoto);
  const takePhotoHint = useFormattedMessage<string>(messages.takePhotoHint);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      slotProps={{
        paper: {
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 240,
            mt: 1,
            direction: 'rtl',
          },
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          px: 2,
          py: 1,
          display: 'block',
          color: 'text.secondary',
          fontWeight: 500,
          fontFamily: 'var(--font-mehr)',
        }}
      >
        {menuTitle}
      </Typography>
      <Divider sx={{ mb: 1 }} />

      <MenuItem
        onClick={() => {
          onSelectGallery();
          onClose();
        }}
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemIcon>
          <GalleryIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={selectFromGallery}
          secondary={selectFromGalleryHint}
          primaryTypographyProps={{ fontWeight: 500, fontFamily: 'var(--font-mehr)' }}
          secondaryTypographyProps={{ variant: 'caption', fontFamily: 'var(--font-mehr)' }}
        />
      </MenuItem>

      <MenuItem
        onClick={() => {
          onSelectCamera();
          onClose();
        }}
        sx={{
          py: 1.5,
          px: 2,
          borderRadius: 1,
          mx: 1,
          mb: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemIcon>
          <CameraIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={takePhoto}
          secondary={takePhotoHint}
          primaryTypographyProps={{ fontWeight: 500, fontFamily: 'var(--font-mehr)' }}
          secondaryTypographyProps={{ variant: 'caption', fontFamily: 'var(--font-mehr)' }}
        />
      </MenuItem>
    </Menu>
  );
};

export default UploadOptionsMenu;
