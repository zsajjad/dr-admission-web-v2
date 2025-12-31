'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

import {
  CameraAlt as CameraIcon,
  Cameraswitch as SwitchCameraIcon,
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon,
  Replay as RetakeIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Dialog, DialogContent, Box, IconButton, CircularProgress, Typography, Fade } from '@mui/material';

import { useFormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';
import { dataURLtoFile } from './utils/optimizeImage';

type FacingMode = 'environment' | 'user';

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ open, onClose, onCapture }) => {
  const cameraErrorText = useFormattedMessage<string>(messages.cameraError);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setIsVideoReady(false);
    setError(null);

    // Stop any existing stream first
    stopStream();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = newStream;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              setIsLoading(false);
              setIsVideoReady(true);
            })
            .catch((err) => {
              console.error('Video play error:', err);
              setError(cameraErrorText);
              setIsLoading(false);
            });
        };

        // Check for torch support
        const track = newStream.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities();
          setTorchSupported('torch' in capabilities);
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(cameraErrorText);
      setIsLoading(false);
    }
  }, [facingMode, cameraErrorText, stopStream]);

  // Start camera when dialog opens
  useEffect(() => {
    if (open && !capturedPhoto) {
      startCamera();
    }
  }, [open, capturedPhoto, startCamera]);

  // Cleanup when dialog closes
  useEffect(() => {
    if (!open) {
      stopStream();
      setCapturedPhoto(null);
      setTorchOn(false);
      setIsLoading(true);
      setError(null);
    }
  }, [open, stopStream]);

  // Handle torch toggle
  useEffect(() => {
    if (streamRef.current && torchSupported) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track?.applyConstraints) {
        track.applyConstraints({ advanced: [{ torch: torchOn } as MediaTrackConstraintSet] }).catch(() => {
          // Torch toggle failed silently
        });
      }
    }
  }, [torchOn, torchSupported]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedPhoto(dataUrl);
      stopStream();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      const file = dataURLtoFile(capturedPhoto, `photo_${Date.now()}.jpg`);
      if (file) {
        onCapture(file);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    stopStream();
    setCapturedPhoto(null);
    setTorchOn(false);
    onClose();
  };

  const handleSwitchCamera = () => {
    stopStream();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleToggleTorch = () => {
    if (torchSupported) {
      setTorchOn((prev) => !prev);
    }
  };

  const showLoading = isLoading && !capturedPhoto && !error;
  const showVideo = !capturedPhoto && isVideoReady && !error;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'black',
          borderRadius: 3,
          overflow: 'hidden',
          m: 2,
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/3', bgcolor: 'black' }}>
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Loading state */}
        {showLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'black',
              zIndex: 5,
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'black',
              zIndex: 5,
              p: 3,
            }}
          >
            <Typography color="error" textAlign="center" sx={{ fontFamily: 'var(--font-mehr)' }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Video preview - always rendered but visibility controlled */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: showVideo ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />

        {/* Captured photo preview */}
        {capturedPhoto && (
          <Fade in>
            <Box
              component="img"
              src={capturedPhoto}
              alt="Captured"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Fade>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>

      {/* Controls */}
      <DialogContent sx={{ bgcolor: 'black', py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {capturedPhoto ? (
            <>
              <IconButton
                onClick={handleRetake}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  p: 1.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <RetakeIcon />
              </IconButton>
              <IconButton
                onClick={handleConfirm}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 2,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <CheckIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <Box sx={{ width: 48 }} /> {/* Spacer */}
            </>
          ) : (
            <>
              <IconButton
                onClick={handleSwitchCamera}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  p: 1.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                <SwitchCameraIcon />
              </IconButton>

              <IconButton
                onClick={handleCapture}
                disabled={!isVideoReady || !!error}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  p: 2,
                  '&:hover': { bgcolor: 'grey.200' },
                  '&:disabled': { bgcolor: 'grey.600' },
                }}
              >
                <CameraIcon sx={{ fontSize: 32 }} />
              </IconButton>

              <IconButton
                onClick={handleToggleTorch}
                disabled={!torchSupported}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: torchOn ? 'warning.main' : 'white',
                  p: 1.5,
                  visibility: torchSupported ? 'visible' : 'hidden',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                {torchOn ? <FlashOnIcon /> : <FlashOffIcon />}
              </IconButton>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
