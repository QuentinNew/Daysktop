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
 * of that oversized image, clamped so it always fully covers the frame.
 */
export function computeImageFraming(zoom: number, focalX: number, focalY: number): ImageFramingStyle {
  const minFocal = 50 / zoom;
  const maxFocal = 100 - minFocal;
  const clampedFocalX = Math.min(maxFocal, Math.max(minFocal, focalX));
  const clampedFocalY = Math.min(maxFocal, Math.max(minFocal, focalY));

  return {
    widthPercent: zoom * 100,
    heightPercent: zoom * 100,
    translateXPercent: 50 / zoom - clampedFocalX,
    translateYPercent: 50 / zoom - clampedFocalY,
  };
}
