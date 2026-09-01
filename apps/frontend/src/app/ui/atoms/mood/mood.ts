import { Component, computed, input } from '@angular/core';

export type MoodFace = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';

@Component({
  selector: 'app-mood',
  imports: [],
  templateUrl: './mood.html',
  styleUrl: './mood.scss',
})
export class Mood {
  readonly face = input.required<MoodFace>();
  readonly color = input('var(--mat-sys-primary)');
  readonly size = input(40);
  readonly label = input<string>();

  protected readonly computedLabel = computed(() => this.label() ?? this.face());
}
