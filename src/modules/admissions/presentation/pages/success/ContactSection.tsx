'use client';

import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Button, Link as MuiLink, Stack } from '@mui/material';

import { FormattedMessage } from '@/theme/FormattedMessage';
import { SectionCard } from '@/theme/SectionCard';

import messages from './messages';

const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/BYfbXO7i7ByKhii1G9Idxi';
const CONTACT_NUMBER = '+923353416334';

export function ContactSection() {
  return (
    <SectionCard titleMessage={messages.contactTitle} showDivider={false}>
      <Stack spacing={2}>
        {/* WhatsApp Community Link */}
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,0,0,0.08)',
            p: 2,
          }}
        >
          <FormattedMessage
            message={messages.whatsappCommunityLabel}
            language="ur"
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'right', mb: 1 }}
          />
          <Button
            component={MuiLink}
            href={WHATSAPP_COMMUNITY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="success"
            startIcon={<WhatsAppIcon />}
            fullWidth
            sx={{ justifyContent: 'center', gap: 2 }}
          >
            <FormattedMessage message={messages.whatsappCommunity} language="ur" />
          </Button>
        </Box>

        {/* Contact Number */}
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,0,0,0.08)',
            p: 2,
          }}
        >
          <FormattedMessage
            message={messages.contactNumber}
            language="ur"
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'right', mb: 1 }}
          />
          <Button
            component={MuiLink}
            href={`tel:${CONTACT_NUMBER}`}
            variant="outlined"
            startIcon={<PhoneIcon />}
            fullWidth
            sx={{ justifyContent: 'center', direction: 'ltr' }}
          >
            {CONTACT_NUMBER}
          </Button>
        </Box>
      </Stack>
    </SectionCard>
  );
}
