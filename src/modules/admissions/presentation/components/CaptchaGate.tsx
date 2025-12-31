'use client';

import { useEffect, useMemo, useState } from 'react';

import { Alert, Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';

import { config } from '@/config';
import { getCaptchaToken, setCaptchaToken } from '@/modules/admissions/infrastructure/captcha/captchaTokenStore';

type Props = {
  onPassed: (token: string) => void;
};

export function CaptchaGate({ onPassed }: Props) {
  const bypass = useMemo(() => config.CAPTCHA_BYPASS === 'true', []);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const existing = getCaptchaToken();
    if (existing) {
      setPassed(true);
      onPassed(existing);
    }
  }, [onPassed]);

  if (passed) {
    return (
      <Alert severity="success" role="status">
        CAPTCHA verified.
      </Alert>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CAPTCHA verification
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please complete CAPTCHA before continuing.
        </Typography>
        <Box sx={{ mt: 2 }}>
          {bypass ? (
            <Alert severity="warning">
              CAPTCHA bypass is enabled via configuration. For production, disable bypass and integrate
              Turnstile/ReCAPTCHA.
            </Alert>
          ) : (
            <Alert severity="info">
              CAPTCHA provider integration (e.g. Cloudflare Turnstile) will be wired next. For now, use “Verify” to
              proceed in dev.
            </Alert>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            const token = bypass ? 'CAPTCHA_BYPASS' : `DEV_CAPTCHA_${Date.now()}`;
            setCaptchaToken(token);
            setPassed(true);
            onPassed(token);
          }}
        >
          Verify
        </Button>
      </CardActions>
    </Card>
  );
}
