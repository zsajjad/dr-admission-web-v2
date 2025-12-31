'use client';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Button } from '@mui/material';

import { FormattedMessage, useFormattedMessage } from '@/theme/FormattedMessage';

import messages from './messages';

type AgeCategory = 'tiflan' | 'muhibaan' | 'nasiraan' | 'unknown';

interface ReminderDetails {
  // Reminder time (1 hour before fee submission)
  reminderDate: Date;
  // Fee submission time
  eventDate: Date;
  title: string;
  description: string;
}

function getAgeCategory(age: number): AgeCategory {
  if (age >= 6 && age <= 9) return 'tiflan';
  if (age >= 10 && age <= 17) return 'muhibaan';
  return 'unknown';
}

function getReminderDetails(age: number, gender: 'MALE' | 'FEMALE', grNumber: string): ReminderDetails {
  const ageCategory = getAgeCategory(age);
  const isMale = gender === 'MALE';

  // Fee submission dates based on rules
  // Tiflan: Jan 1, 2026 at 8 PM PKT (UTC+5)
  // Muhibaan/Nasiraan Boys: Jan 1, 2026 at 7 PM PKT (Saturday)
  // Muhibaan/Nasiraan Girls: Jan 2, 2026 at 7 PM PKT (Sunday)

  let eventDate: Date;
  let title: string;

  if (ageCategory === 'tiflan') {
    // Tiflan: Jan 1, 2026 at 8 PM PKT
    eventDate = new Date('2026-01-01T20:00:00+05:00');
    title = 'دانشگاہ رمضانِ کی فیس جمع کرانے کا وقت - Tiflan Fee Submission';
  } else if (isMale) {
    // Boys: Jan 1, 2026 at 7 PM PKT (Saturday)
    eventDate = new Date('2026-01-01T19:00:00+05:00');
    title = 'دانشگاہ رمضانِ کی فیس جمع کرانے کا وقت - Muhibaan/Nasiraan Boys Fee';
  } else {
    // Girls: Jan 2, 2026 at 7 PM PKT (Sunday)
    eventDate = new Date('2026-01-02T19:00:00+05:00');
    title = 'دانشگاہ رمضانِ کی فیس جمع کرانے کا وقت - Muhibaan/Nasiraan Girls Fee';
  }

  // Reminder is 1 hour before
  const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000);

  const description = `GR Number: ${grNumber}\n\nفیس: 300 روپے\nFee: PKR 300\n\nبراہ کرم وقت پر پہنچیں۔\nPlease arrive on time.`;

  return { reminderDate, eventDate, title, description };
}

function formatDateForICS(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function generateICSContent(details: ReminderDetails): string {
  const { eventDate, title, description } = details;

  // Event duration: 3 hours (fee submission window)
  const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DR Admission//Fee Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateForICS(eventDate)}`,
    `DTEND:${formatDateForICS(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'LOCATION:Madressa',
    // Reminder 1 hour before
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    `UID:${Date.now()}@dr-admission`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

function downloadICSFile(details: ReminderDetails) {
  const icsContent = generateICSContent(details);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'fee-reminder.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ReminderButtonProps {
  age: number;
  gender: 'MALE' | 'FEMALE';
  grNumber: string;
}

export function ReminderButton({ age, gender, grNumber }: ReminderButtonProps) {
  const handleSetReminder = () => {
    const details = getReminderDetails(age, gender, grNumber);
    downloadICSFile(details);
  };

  return (
    <Button
      variant="contained"
      color="warning"
      startIcon={<NotificationsActiveIcon />}
      onClick={handleSetReminder}
      fullWidth
      sx={{ mt: 3, gap: 2 }}
    >
      <FormattedMessage message={messages.setReminder} language="ur" />
    </Button>
  );
}
