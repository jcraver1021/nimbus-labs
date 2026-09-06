export type NimbusAppId = 'root' | 'bio' | 'compsci' | 'geo';

const DEFAULT_URLS: Record<NimbusAppId, string> = {
  root: 'https://nimbus-laboratories.web.app',
  bio: 'https://nimbus-laboratories-bio.web.app',
  compsci: 'https://nimbus-laboratories-compsci.web.app',
  geo: 'https://nimbus-laboratories-geo.web.app',
};

/**
 * Deployed URL for a Nimbus Labs app. Each app is its own Firebase Hosting
 * site, so cross-app navigation always needs an absolute URL rather than a
 * router path.
 */
export function getNimbusAppUrl(id: NimbusAppId): string {
  return DEFAULT_URLS[id];
}
