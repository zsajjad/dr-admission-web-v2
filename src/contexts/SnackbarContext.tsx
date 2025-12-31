'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface SnackbarOptions {
  message: string;
  severity?: AlertColor;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (options: SnackbarOptions) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarContextProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SnackbarOptions>({ message: '' });

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showSnackbar({ message, severity: 'success' });
    },
    [showSnackbar],
  );

  const showError = useCallback(
    (message: string) => {
      showSnackbar({ message, severity: 'error' });
    },
    [showSnackbar],
  );

  const showWarning = useCallback(
    (message: string) => {
      showSnackbar({ message, severity: 'warning' });
    },
    [showSnackbar],
  );

  const showInfo = useCallback(
    (message: string) => {
      showSnackbar({ message, severity: 'info' });
    },
    [showSnackbar],
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options.duration || 5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={options.severity || 'info'} sx={{ width: '100%' }}>
          {options.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarContextProvider');
  }
  return context;
}
