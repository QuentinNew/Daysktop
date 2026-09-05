import { Component, computed, input, output, signal } from '@angular/core';
import { computeImageFraming } from '../../../media/image-framing';
import { getCachedAspectRatio, setCachedAspectRatio } from '../../../media/image-aspect-ratio-cache';

export interface ImageFraming {
  zoom: number;
  focalX: number;
  focalY: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

@Component({
  selector: 'app-image-framer',
  imports: [],
  templateUrl: './image-framer.html',
  styleUrl: './image-framer.scss',
})
export class ImageFramer {
  readonly image = input.required<string>();
  readonly size = input(120);
  readonly zoom = input(1);
  readonly focalX = input(50);
  readonly focalY = input(50);

  readonly framingChange = output<ImageFraming>();

  private readonly loaded = signal<{ url: string; ratio: number } | null>(null);
  private readonly loadedRatio = computed(() => (this.loaded()?.url === this.image() ? this.loaded()!.ratio : null));
  protected readonly aspectRatio = computed(() => this.loadedRatio() ?? getCachedAspectRatio(this.image()) ?? 1);
  protected readonly ready = computed(
    () => this.loadedRatio() !== null || getCachedAspectRatio(this.image()) !== undefined,
  );
  protected readonly framing = computed(() =>
    computeImageFraming(this.zoom(), this.focalX(), this.focalY(), this.aspectRatio()),
  );

  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  protected onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setCachedAspectRatio(this.image(), ratio);
      this.loaded.set({ url: this.image(), ratio });
    }
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    const nextZoom = clamp(this.zoom() + (event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP), MIN_ZOOM, MAX_ZOOM);
    this.framingChange.emit({ zoom: nextZoom, focalX: this.focalX(), focalY: this.focalY() });
  }

  protected onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    const currentFraming = this.framing();
    const boxWidth = (this.size() * currentFraming.widthPercent) / 100;
    const boxHeight = (this.size() * currentFraming.heightPercent) / 100;
    const nextFocalX = clamp(this.focalX() - (dx / boxWidth) * 100, 0, 100);
    const nextFocalY = clamp(this.focalY() - (dy / boxHeight) * 100, 0, 100);
    this.framingChange.emit({ zoom: this.zoom(), focalX: nextFocalX, focalY: nextFocalY });
  }

  protected onPointerUp(): void {
    this.dragging = false;
  }
}
