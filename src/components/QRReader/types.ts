export interface QRReaderProps {
  isLoading?: boolean;
  error?: string;
  label?: string | React.ReactNode;
  onComplete: (qrContent: string) => boolean;
  onCameraStopped?: () => void;
}

export interface QRHookProps {
  headerHeight: number;
}
