import { Component, computed, input, output, signal } from '@angular/core';
import { Tile } from '../../layout/tile/tile';
import { computeImageFraming } from '../../../media/image-framing';
import { getCachedAspectRatio, setCachedAspectRatio } from '../../../media/image-aspect-ratio-cache';

@Component({
  selector: 'app-media-card',
  imports: [Tile],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  readonly image = input.required<string>();
  readonly name = input.required<string>();
  readonly size = input(160);
  readonly selected = input(false);
  readonly noText = input(false);
  readonly deletable = input(false);
  readonly zoom = input(1);
  readonly focalX = input(50);
  readonly focalY = input(50);

  readonly deleteClick = output<void>();

  private readonly loaded = signal<{ url: string; ratio: number } | null>(null);
  private readonly loadedRatio = computed(() => (this.loaded()?.url === this.image() ? this.loaded()!.ratio : null));
  protected readonly aspectRatio = computed(() => this.loadedRatio() ?? getCachedAspectRatio(this.image()) ?? 1);
  protected readonly ready = computed(
    () => this.loadedRatio() !== null || getCachedAspectRatio(this.image()) !== undefined,
  );
  protected readonly framing = computed(() =>
    computeImageFraming(this.zoom(), this.focalX(), this.focalY(), this.aspectRatio()),
  );

  protected onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setCachedAspectRatio(this.image(), ratio);
      this.loaded.set({ url: this.image(), ratio });
    }
  }
}
