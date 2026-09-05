export interface ImageFramingStyle {
  widthPercent: number;
  heightPercent: number;
  translateXPercent: number;
  translateYPercent: number;
}

/**
 * Renders the zoom by growing the image element itself (so the browser resamples
 * crisply from the source) instead of CSS `transform: scale`, which would just
 * blow up the already-rasterized thumbnail bitmap. Panning is then a `translate`
 * of that oversized image, clamped so it always fully covers the (square) frame.
 *
 * The image box is sized per-axis from the source's natural aspect ratio, matching
 * what `object-fit: cover` would already crop into a square frame at zoom 1 — e.g. a
 * wide image has no vertical slack (height ratio 1) but horizontal slack (width ratio
 * > 1), so panning sideways is available even without extra zoom, while a square
 * image has no slack on either axis until the user zooms in.
 */
export function computeImageFraming(
  zoom: number,
  focalX: number,
  focalY: number,
  aspectRatio: number,
): ImageFramingStyle {
  const widthRatio = Math.max(aspectRatio, 1);
  const heightRatio = Math.max(1 / aspectRatio, 1);
  const zoomX = zoom * widthRatio;
  const zoomY = zoom * heightRatio;

  const minFocalX = 50 / zoomX;
  const maxFocalX = 100 - minFocalX;
  const clampedFocalX = Math.min(maxFocalX, Math.max(minFocalX, focalX));

  const minFocalY = 50 / zoomY;
  const maxFocalY = 100 - minFocalY;
  const clampedFocalY = Math.min(maxFocalY, Math.max(minFocalY, focalY));

  return {
    widthPercent: zoomX * 100,
    heightPercent: zoomY * 100,
    translateXPercent: 50 / zoomX - clampedFocalX,
    translateYPercent: 50 / zoomY - clampedFocalY,
  };
}
