import { Component, input } from '@angular/core';
import { TextTile } from '../text-tile/text-tile';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-tile-with-title',
  imports: [TextTile, Tile],
  templateUrl: './tile-with-title.html',
  styleUrl: './tile-with-title.scss',
})
export class TileWithTitle {
  readonly title = input.required<string>();
  readonly width = input(420);
}
