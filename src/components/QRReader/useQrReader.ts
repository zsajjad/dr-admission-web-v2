'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import jsQR from 'jsqr';

import { useFormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';

const headerHeight = 240;

type QrReaderStatus =
  | 'idle'
  | 'requesting_permission'
  | 'ready'
  | 'scanning'
  | 'paused'
  | 'permission_denied'
  | 'no_camera'
  | 'error';

const useQrReader = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraIsPaused, setCameraIsPaused] = useState(false);
  const [status, setStatus] = useState<QrReaderStatus>('idle');
  const [hint, setHint] = useState<string | null>(null);

  const permissionPromptTitle = useFormattedMessage(messages.permissionPromptTitle);
  const permissionPromptBody = useFormattedMessage(messages.permissionPromptBody);
  const permissionDeniedTitle = useFormattedMessage(messages.permissionDeniedTitle);
  const permissionDeniedBody = useFormattedMessage(messages.permissionDeniedBody);
  const noCameraTitle = useFormattedMessage(messages.noCameraTitle);
  const noCameraBody = useFormattedMessage(messages.noCameraBody);
  const genericError = useFormattedMessage(messages.genericError);
  const insecureContextTitle = useFormattedMessage(messages.insecureContextTitle);
  const insecureContextBody = useFormattedMessage(messages.insecureContextBody);
  const scanningHint = useFormattedMessage(messages.scanningHint);

  const canvasWrapper = useMemo(() => {
    // This module is imported during Next.js prerender/build. Guard `document`
    // usage so we don't crash on the server.
    if (typeof document === 'undefined') return null;
    return document.getElementById('QRInput');
  }, []);

  const lastHintAtRef = useRef<number>(0);
  const lastFrameAtRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      if (!videoRef.current.paused) {
        setCameraIsPaused(true);
        videoRef.current.pause();
      }
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const maybeSetHint = useCallback(
    (nextHint: string) => {
      // Avoid spamming UI updates while scanning
      const now = Date.now();
      if (now - lastHintAtRef.current < 1500) return;
      lastHintAtRef.current = now;
      setHint(nextHint);
    },
    [setHint],
  );

  const drawToCanvas = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      if (video.paused) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      // Throttle decode attempts (lower-end devices struggle otherwise)
      const now = performance.now();
      if (now - lastFrameAtRef.current < 120) {
        requestAnimationFrame(drawToCanvas);
        return;
      }
      lastFrameAtRef.current = now;

      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code && code.data) {
        setHint(null);
        setData(code.data);
        setError(null);
        stopCamera();
        setStatus('paused');
        return;
      }

      // No QR detected yet → show a gentle Urdu hint (not an error)
      maybeSetHint(scanningHint as string);

      requestAnimationFrame(drawToCanvas); // Keep scanning if no QR code found
    }
  }, [maybeSetHint, scanningHint, stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setHint(null);
      setCameraIsPaused(false);
      setStatus('requesting_permission');

      // Camera permissions require a secure context (HTTPS) on mobile browsers.
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setCameraIsPaused(true);
        setStatus('error');
        setError(`${insecureContextTitle}\n${insecureContextBody}` as string);
        return;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraIsPaused(true);
        setStatus('error');
        setError(`${insecureContextTitle}\n${insecureContextBody}` as string);
        return;
      }

      // Best-effort pre-hint for users before the browser prompt shows up
      if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
        try {
          // Some browsers don't support 'camera' permission querying
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (navigator.permissions as any).query({ name: 'camera' });
          if (result?.state === 'prompt') {
            maybeSetHint(`${permissionPromptTitle}\n${permissionPromptBody}` as string);
          }
        } catch {
          // Ignore; permission querying isn't universally supported (e.g. iOS Safari)
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setError(null);
            setCameraIsPaused(false);
            setStatus('scanning');
            videoRef.current.play();
          }
          const canvas = canvasRef.current;
          if (canvas && videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
          }
          requestAnimationFrame(drawToCanvas);
        };
      }
    } catch (err) {
      setCameraIsPaused(true);

      const e = err as { name?: string; message?: string };
      const name = e?.name ?? '';

      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setStatus('permission_denied');
        setError(`${permissionDeniedTitle}\n${permissionDeniedBody}` as string);
        return;
      }

      if (name === 'SecurityError') {
        setStatus('error');
        setError(`${insecureContextTitle}\n${insecureContextBody}` as string);
        return;
      }

      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setStatus('no_camera');
        setError(`${noCameraTitle}\n${noCameraBody}` as string);
        return;
      }

      setStatus('error');
      setError(genericError as string);
    }
  }, [
    drawToCanvas,
    genericError,
    maybeSetHint,
    noCameraBody,
    noCameraTitle,
    insecureContextBody,
    insecureContextTitle,
    permissionDeniedBody,
    permissionDeniedTitle,
    permissionPromptBody,
    permissionPromptTitle,
  ]);

  // update canvas size on header size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef?.current || !headerHeight) return;
      const canvasHeight = window.innerHeight - headerHeight;
      canvasRef.current.style.height = `${canvasHeight}px`;
    };
    // Initial update
    updateCanvasSize();
    // Update on window resize
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasWrapper]);

  // Stop camera when unmounted
  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, [stopCamera]);

  // Remove transient scanning hint after timeout (keep permission errors visible)
  useEffect(() => {
    if (!hint) return;
    const timer = setTimeout(() => setHint(null), 8000);
    return () => clearTimeout(timer);
  }, [hint]);

  return {
    videoRef,
    canvasRef,
    data,
    setData,
    error,
    startCamera,
    stopCamera,
    setError,
    cameraIsPaused,
    status,
    hint,
    setHint,
  };
};

export default useQrReader;
