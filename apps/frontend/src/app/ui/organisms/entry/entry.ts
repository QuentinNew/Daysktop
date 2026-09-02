import { Component, computed, input } from '@angular/core';
import { TextTile } from '../../layout/text-tile/text-tile';
import { Mood, MoodFace } from '../../atoms/mood/mood';
import { Icon } from '../../atoms/icon/icon';
import { Activity } from '../../molecules/activity/activity';

export interface EntryActivity {
  label: string;
}

@Component({
  selector: 'app-entry',
  imports: [TextTile, Mood, Icon, Activity],
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
})
export class Entry {
  readonly date = input.required<Date>();
  readonly width = input(320);
  readonly moodFace = input.required<MoodFace>();
  readonly moodColor = input('var(--mat-sys-primary)');
  readonly moodName = input.required<string>();
  readonly activities = input<EntryActivity[]>([]);
  readonly note = input('');

  protected readonly formattedDate = computed(() =>
    new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      this.date(),
    ),
  );
}
