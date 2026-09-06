import type {ReactNode} from 'react';
import {Typography} from '@mui/material';
import {NimbusBreadcrumbs, type NimbusBreadcrumbItem} from './Breadcrumbs';

export interface NimbusPageHeaderProps {
  breadcrumbs?: NimbusBreadcrumbItem[]; // Omit for a top-level app with no breadcrumb trail (e.g. the portal's own home page).
  title: string;
  children?: ReactNode; // Description content rendered below the title.
}

/**
 * Breadcrumb trail + title + optional description shared by every app's
 * top-level pages.
 */
export function NimbusPageHeader({
  breadcrumbs,
  title,
  children,
}: NimbusPageHeaderProps) {
  return (
    <>
      {breadcrumbs && <NimbusBreadcrumbs items={breadcrumbs} />}
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>
      {children}
    </>
  );
}
