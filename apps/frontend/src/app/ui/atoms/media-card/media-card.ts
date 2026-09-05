import { Component, input } from '@angular/core';
import { Tile } from '../../layout/tile/tile';

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
}
