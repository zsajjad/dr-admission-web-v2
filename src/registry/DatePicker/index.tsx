'use client';

import React, { createContext, useContext, ReactNode } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type DatePickerContextType = object;

const DatePickerContext = createContext<DatePickerContextType | undefined>(undefined);

export function DatePickerProvider({ children }: { children: ReactNode }) {
  return (
    <DatePickerContext.Provider value={{}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
    </DatePickerContext.Provider>
  );
}

export function useDatePicker() {
  const context = useContext(DatePickerContext);
  if (context === undefined) {
    throw new Error('useDatePicker must be used within a DatePickerProvider');
  }
  return context;
}
