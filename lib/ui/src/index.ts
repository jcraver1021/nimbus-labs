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

export {NimbusInfoPanel, type NimbusInfoPanelProps} from './InfoPanel';

export {
  NimbusSpeedSlider,
  type NimbusSpeedSliderProps,
} from './visualizer/SpeedSlider';

export {
  NimbusArraySizeSlider,
  type NimbusArraySizeSliderProps,
  NIMBUS_MIN_ARRAY_SIZE,
  NIMBUS_MAX_ARRAY_SIZE,
  NIMBUS_DEFAULT_ARRAY_SIZE,
} from './visualizer/ArraySizeSlider';

export {
  NimbusRunControls,
  type NimbusRunControlsProps,
} from './visualizer/RunControls';

export {NimbusPageHeader, type NimbusPageHeaderProps} from './PageHeader';

export {NimbusLinkCard, type NimbusLinkCardProps} from './LinkCard';
