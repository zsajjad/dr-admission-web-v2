'use client';

import React, { useState, useRef, useCallback } from 'react';

import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  BrokenImage as BrokenImageIcon,
} from '@mui/icons-material';
import { Box, Paper, Typography, IconButton, CircularProgress, Skeleton, Fade, alpha } from '@mui/material';

import { AssetsControllerUploadPublicType } from '@/providers/service/app.schemas';
import {
  useAssetsControllerUploadPublic,
  useAssetsControllerDelete,
  useAssetsControllerGetDetail,
} from '@/providers/service/assets/assets';

import { useFormattedMessage } from '@/theme/FormattedMessage';

import { useSnackbar } from '@/contexts/SnackbarContext';

import CameraCapture from './CameraCapture';
import messages from './messages';
import UploadOptionsMenu from './UploadOptionsMenu';
import { optimizeImage } from './utils/optimizeImage';

export interface ImageUploaderProps {
  /** Existing asset ID to display */
  assetId?: string | null;
  /** Called when upload succeeds with the new asset ID */
  onSuccess?: (assetId: string) => void;
  /** Called when asset is deleted */
  onDelete?: () => void;
  /** Category for the uploaded asset */
  category: string;
  /** Upload type */
  type?: AssetsControllerUploadPublicType;
  /** Placeholder text (optional, uses default Urdu message) */
  placeholder?: string;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Custom height for the upload area */
  height?: number | string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  assetId,
  onSuccess,
  onDelete,
  category,
  type = AssetsControllerUploadPublicType.IMAGE,
  placeholder,
  disabled = false,
  height = 200,
}) => {
  const { showSuccess, showError } = useSnackbar();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Formatted messages
  const placeholderDefault = useFormattedMessage<string>(messages.placeholder);
  const placeholderHintText = useFormattedMessage<string>(messages.placeholderHint);
  const optimizingText = useFormattedMessage<string>(messages.optimizing);
  const uploadingText = useFormattedMessage<string>(messages.uploading);
  const deletingText = useFormattedMessage<string>(messages.deleting);
  const loadFailedText = useFormattedMessage<string>(messages.loadFailed);
  const uploadSuccessText = useFormattedMessage<string>(messages.uploadSuccess);
  const uploadErrorText = useFormattedMessage<string>(messages.uploadError);
  const deleteSuccessText = useFormattedMessage<string>(messages.deleteSuccess);
  const deleteErrorText = useFormattedMessage<string>(messages.deleteError);
  const invalidFileTypeText = useFormattedMessage<string>(messages.invalidFileType);

  // API hooks
  const uploadMutation = useAssetsControllerUploadPublic();
  const deleteMutation = useAssetsControllerDelete();
  const { data: assetDetail, isLoading: isLoadingAsset } = useAssetsControllerGetDetail(assetId ?? '', {
    query: {
      enabled: !!assetId,
    },
  });

  const isUploading = uploadMutation.isPending || isOptimizing;
  const isDeleting = deleteMutation.isPending;
  const hasAsset = !!assetId || !!previewUrl;
  const displayUrl = assetDetail?.signedUrl || previewUrl;
  const placeholderText = placeholder || placeholderDefault;

  const isValidFileType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg'];
    return validTypes.includes(file.type.toLowerCase());
  };

  const handleUpload = useCallback(
    async (file: File) => {
      try {
        setIsOptimizing(true);
        setImageError(false);

        // Create preview URL
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        // Optimize image
        const optimizedFile = await optimizeImage(file);

        setIsOptimizing(false);

        // Upload
        const result = await uploadMutation.mutateAsync({
          data: { file: optimizedFile },
          params: { type, category },
        });

        // Clean up preview URL
        URL.revokeObjectURL(localPreview);
        setPreviewUrl(null);

        // Call success callback
        if (result?.id) {
          onSuccess?.(result.id);
          showSuccess(uploadSuccessText);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setPreviewUrl(null);
        setIsOptimizing(false);
        showError(uploadErrorText);
      }
    },
    [uploadMutation, type, category, onSuccess, showSuccess, showError, uploadSuccessText, uploadErrorText],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!isValidFileType(file)) {
        showError(invalidFileTypeText);
      } else {
        handleUpload(file);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!assetId) {
      setPreviewUrl(null);
      onDelete?.();
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id: assetId });
      setPreviewUrl(null);
      onDelete?.();
      showSuccess(deleteSuccessText);
    } catch (error) {
      console.error('Delete failed:', error);
      showError(deleteErrorText);
    }
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !isUploading && !isDeleting) {
      setMenuAnchor(event.currentTarget);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleSelectGallery = () => {
    fileInputRef.current?.click();
  };

  const handleSelectCamera = () => {
    setCameraOpen(true);
  };

  const handleCameraCapture = (file: File) => {
    handleUpload(file);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getStatusText = () => {
    if (isOptimizing) return optimizingText;
    if (isDeleting) return deletingText;
    return uploadingText;
  };

  return (
    <>
      <Paper
        elevation={0}
        onClick={!hasAsset ? handleOpenMenu : undefined}
        sx={{
          position: 'relative',
          height,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: hasAsset ? 'transparent' : 'divider',
          bgcolor: hasAsset ? 'transparent' : alpha('#000', 0.02),
          overflow: 'hidden',
          cursor: !hasAsset && !disabled ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          ...(!hasAsset &&
            !disabled && {
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: alpha('#000', 0.04),
              },
            }),
        }}
      >
        {/* Loading skeleton for fetching existing asset */}
        {isLoadingAsset && assetId && (
          <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, borderRadius: 2 }} animation="wave" />
        )}

        {/* Empty state / Upload prompt */}
        {!hasAsset && !isLoadingAsset && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              p: 2,
            }}
          >
            <UploadIcon
              sx={{
                fontSize: 48,
                color: 'action.disabled',
                transition: 'color 0.2s',
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ fontFamily: 'var(--font-mehr)' }}
            >
              {placeholderText}
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              textAlign="center"
              sx={{ fontFamily: 'var(--font-mehr)' }}
            >
              {placeholderHintText}
            </Typography>
          </Box>
        )}

        {/* Image preview */}
        {(displayUrl || previewUrl) && !imageError && (
          <Fade in>
            <Box
              component="img"
              src={displayUrl || previewUrl || ''}
              alt="Uploaded image"
              onError={handleImageError}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </Fade>
        )}

        {/* Image error state */}
        {imageError && hasAsset && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              borderRadius: 2,
            }}
          >
            <BrokenImageIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'var(--font-mehr)' }}>
              {loadFailedText}
            </Typography>
          </Box>
        )}

        {/* Loading overlay */}
        {(isUploading || isDeleting) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2,
              zIndex: 5,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={32} />
              <Typography variant="caption" display="block" sx={{ mt: 1, fontFamily: 'var(--font-mehr)' }}>
                {getStatusText()}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Action buttons for uploaded image */}
        {hasAsset && !isUploading && !isDeleting && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 0.5,
              zIndex: 2,
            }}
          >
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              disabled={disabled}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 1,
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDelete}
              disabled={disabled}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: 1,
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light', color: 'white' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Paper>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,.jpg,.jpeg"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Upload options menu */}
      <UploadOptionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        onSelectGallery={handleSelectGallery}
        onSelectCamera={handleSelectCamera}
      />

      {/* Camera capture dialog */}
      <CameraCapture open={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={handleCameraCapture} />
    </>
  );
};

export default ImageUploader;
