import { Component, input } from '@angular/core';
import { Mood, MoodFace } from '../../atoms/mood/mood';

@Component({
  selector: 'app-mood-button',
  imports: [Mood],
  templateUrl: './mood-button.html',
  styleUrl: './mood-button.scss',
})
export class MoodButton {
  readonly face = input.required<MoodFace>();
  readonly color = input('var(--mat-sys-primary)');
  readonly size = input(40);
  readonly selected = input(false);
}
