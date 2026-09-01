import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tile',
  imports: [],
  templateUrl: './tile.html',
  styleUrl: './tile.scss',
})
export class Tile {
  readonly color = input('var(--mat-sys-secondary)');
  readonly width = input(64);
  readonly height = input(64);
}
