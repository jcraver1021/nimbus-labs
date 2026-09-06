# @nimbus-labs/ui

Shared MUI theme and navigation primitives used across Nimbus Labs apps. Part of
[`lib/`](../README.md); see the [repo root](../../README.md) for the full project layout.

- `createNimbusTheme(overrides)` - builds an app's theme from the shared base (typography, shape)
  plus that app's own palette overrides.
- `NimbusBreadcrumbs` - a breadcrumb trail rooted at "Nimbus Labs" (linking to the portal app)
  followed by the current app's own hierarchy.
- `getNimbusAppUrl(id)` - the deployed URL for a given Nimbus Labs app, since each app is its own
  Firebase Hosting site.
- `NimbusErrorBoundary` - catches render errors from its subtree and shows a fallback message
  instead of leaving the app blank after a crash.
- `NimbusPageHeader` - breadcrumb trail + title + optional description, shared by every app's
  top-level pages.
- `NimbusLinkCard` - a card linking to a sub-app or sub-page, for app landing pages.
- `NimbusInfoPanel` - a title, optional subtitle, and optional code block; apps extend it for their
  own domain-specific info panels (e.g. compsci's `AlgorithmInfoPanel`, which wraps it with an
  algorithm's name/time-complexity/pseudocode).
- `NimbusSpeedSlider` / `NimbusArraySizeSlider` - the playback-speed and array-size controls shared
  by the sort and search visualizers (`visualizer/`).
- `NimbusRunControls` - the Generate/Run/Stop button row shared by the sort and search visualizers
  (`visualizer/`).

## Structure

```text
lib/ui/
└── src/
    ├── visualizer/   # Controls specific to the algorithm-visualizer shape (compsci today)
    ├── index.ts      # Public export surface
    └── *.tsx, *.ts   # Everything else: broadly applicable theme/navigation/layout primitives
```
