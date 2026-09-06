/**
 * Nimbus UI - Shared MUI theme and navigation primitives for Nimbus Labs apps
 */

export {createNimbusTheme} from './theme';

export {
  NimbusBreadcrumbs,
  type NimbusBreadcrumbItem,
  type NimbusBreadcrumbsProps,
} from './Breadcrumbs';

export {getNimbusAppUrl, type NimbusAppId} from './links';

export {
  NimbusErrorBoundary,
  type NimbusErrorBoundaryProps,
} from './ErrorBoundary';
