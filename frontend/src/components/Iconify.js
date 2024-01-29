// icons
import { Icon } from '@iconify/react';
// @mui
import { Box, Tooltip } from '@mui/material';

export default function Iconify({ icon, sx, title, ...other }) {
  if (title) {
    return <Tooltip title={title}>
      <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} /></Tooltip>;
  }
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
