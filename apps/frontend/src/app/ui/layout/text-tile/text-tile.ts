import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-tile',
  imports: [],
  templateUrl: './text-tile.html',
  styleUrl: './text-tile.scss',
})
export class TextTile {
  readonly color = input('var(--mat-sys-primary)');
  readonly width = input(240);
}
