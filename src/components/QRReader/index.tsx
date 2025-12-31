import { forwardRef, useEffect, useImperativeHandle } from 'react';

import { ArrowCircleLeftOutlined, ArrowForwardOutlined } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress } from '@mui/material';

import { FormattedMessage, useFormattedMessage } from '@/theme/FormattedMessage';
import { Typography } from '@/theme/Typography';

import messages from './messages';
import { QRReaderProps } from './types';
import useQrReader from './useQrReader';

const QRReader = forwardRef(({ onComplete, isLoading, label, error: contextError }: QRReaderProps, ref) => {
  const { canvasRef, videoRef, error, data, setData, startCamera, stopCamera, setError, cameraIsPaused, status, hint } =
    useQrReader();

  const invalidQr = useFormattedMessage(messages.invalidQr);
  const tryAgain = useFormattedMessage(messages.tryAgain);

  useImperativeHandle(ref, () => ({
    stopCamera, // Expose stopCamera to parent
  }));

  useEffect(() => {
    if (isLoading) {
      setError(null);
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, stopCamera]);

  useEffect(() => {
    if (data) {
      try {
        const isCompleted = onComplete(data);
        if (!isCompleted) {
          setData(null);
          setError(tryAgain as string);
        }
      } catch {
        setError(invalidQr as string);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (contextError) {
      setError(contextError);
      setData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextError]);

  const isBusy = status === 'requesting_permission' || isLoading;
  const isScanning = status === 'scanning';
  const showActionButton = !isScanning && !isBusy;
  const isRetry =
    status === 'permission_denied' ||
    status === 'no_camera' ||
    status === 'error' ||
    (!!(error || contextError) && cameraIsPaused);

  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 1,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'black',
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          px: 2,
        }}
      >
        {label ? (
          <Box
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              py: 1.5,
              px: 2,
              borderRadius: 2,
              textAlign: 'center',
              width: 'min(max-content, 92%)',
            }}
          >
            <Typography language="ur" variant="body1" color="white">
              {label}
            </Typography>
          </Box>
        ) : null}

        {showActionButton ? (
          <Button
            onClick={startCamera}
            variant="contained"
            color="primary"
            startIcon={isRetry ? <ArrowCircleLeftOutlined /> : <ArrowForwardOutlined />}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              whiteSpace: 'nowrap',
            }}
          >
            <FormattedMessage message={isRetry ? messages.retryScanButton : messages.startCameraButton} language="ur" />
          </Button>
        ) : null}
      </Box>

      <video ref={videoRef} muted playsInline style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {hint ? (
          <Alert
            severity="info"
            variant="filled"
            sx={{ bgcolor: 'rgba(255,255,255,0.92)', color: 'black', direction: 'rtl', gap: 1 }}
          >
            <Typography language="ur" variant="body2" color="text.primary">
              {hint}
            </Typography>
          </Alert>
        ) : null}

        {error ? (
          <Alert
            severity="error"
            variant="filled"
            sx={{ bgcolor: 'rgba(255,255,255,0.92)', color: 'black', direction: 'rtl' }}
          >
            <Typography language="ur" variant="body2" color="error.main">
              {error}
            </Typography>
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
});

export default QRReader;
QRReader.displayName = 'QRReader';
