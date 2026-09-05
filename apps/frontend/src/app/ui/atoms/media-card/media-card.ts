import { Component, computed, input, output } from '@angular/core';
import { Tile } from '../../layout/tile/tile';
import { computeImageFraming } from '../../../media/image-framing';

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

  protected readonly framing = computed(() => computeImageFraming(this.zoom(), this.focalX(), this.focalY()));
}
