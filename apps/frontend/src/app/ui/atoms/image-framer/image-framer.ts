import { Component, computed, input, output } from '@angular/core';
import { computeImageFraming } from '../../../media/image-framing';

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

  protected readonly framing = computed(() => computeImageFraming(this.zoom(), this.focalX(), this.focalY()));

  private dragging = false;
  private lastX = 0;
  private lastY = 0;

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

    const sensitivity = 100 / (this.size() * this.zoom());
    const nextFocalX = clamp(this.focalX() - dx * sensitivity, 0, 100);
    const nextFocalY = clamp(this.focalY() - dy * sensitivity, 0, 100);
    this.framingChange.emit({ zoom: this.zoom(), focalX: nextFocalX, focalY: nextFocalY });
  }

  protected onPointerUp(): void {
    this.dragging = false;
  }
}
