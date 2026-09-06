import {Box, Typography} from '@mui/material';

export interface NimbusInfoPanelProps {
  title: string;
  subtitle?: string;
  code?: string; // Optional pseudocode/snippet shown below the subtitle.
}

/**
 * A title, optional subtitle, and optional code block — the generic shape
 * behind things like an algorithm's name/complexity/pseudocode, extended by
 * apps for their own domain-specific info panels.
 */
export function NimbusInfoPanel({title, subtitle, code}: NimbusInfoPanelProps) {
  return (
    <Box sx={{flex: 1, minWidth: 0}}>
      <Typography variant="h6">{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
      )}
      {code && (
        <Box
          component="pre"
          sx={{
            fontFamily: "'Source Code Pro', monospace",
            textAlign: 'left',
            padding: '0.2em 0.4em',
            borderRadius: 1,
            maxHeight: 260,
            overflowY: 'auto',
            margin: 0,
          }}
        >
          {code}
        </Box>
      )}
    </Box>
  );
}
