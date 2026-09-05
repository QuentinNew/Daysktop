const cache = new Map<string, number>();

/**
 * Shared across every media-card/image-framer instance so an image's aspect ratio,
 * once known, is available instantly the next time that same URL is rendered
 * anywhere (calendar grid, picker list, edit panel) instead of re-triggering the
 * "loads square, then snaps to the real crop" flash.
 */
export function getCachedAspectRatio(url: string): number | undefined {
  return cache.get(url);
}

export function setCachedAspectRatio(url: string, ratio: number): void {
  cache.set(url, ratio);
}
