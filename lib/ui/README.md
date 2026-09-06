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
