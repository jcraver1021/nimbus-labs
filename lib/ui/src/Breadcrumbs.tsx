import {Link as RouterLink} from 'react-router-dom';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import {getNimbusAppUrl} from './links';

export interface NimbusBreadcrumbItem {
  label: string;
  href?: string; // Path within the current app, or an absolute URL to another app.
}

export interface NimbusBreadcrumbsProps {
  items: NimbusBreadcrumbItem[]; // Trail below the root "Nimbus Labs" crumb, which is added automatically.
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/**
 * Renders a breadcrumb trail rooted at "Nimbus Labs" (linking to the portal
 * app) followed by the current app's own hierarchy.
 */
export function NimbusBreadcrumbs({items}: NimbusBreadcrumbsProps) {
  const trail: NimbusBreadcrumbItem[] = [
    {label: 'Nimbus Labs', href: getNimbusAppUrl('root')},
    ...items,
  ];

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{mb: 3}}>
      {trail.map((item, index) => {
        const isLast = index === trail.length - 1;

        if (isLast || !item.href) {
          return (
            <Typography key={item.label} color="text.primary">
              {item.label}
            </Typography>
          );
        }

        return isExternal(item.href) ? (
          <MuiLink
            key={item.label}
            href={item.href}
            underline="hover"
            color="inherit"
          >
            {item.label}
          </MuiLink>
        ) : (
          <MuiLink
            key={item.label}
            component={RouterLink}
            to={item.href}
            underline="hover"
            color="inherit"
          >
            {item.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
}
