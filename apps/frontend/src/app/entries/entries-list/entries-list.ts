import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntriesService } from '../entries.service';
import { Entry } from '../entry.model';
import { Entry as EntryOrganism, EntryActivity } from '../../ui/organisms/entry/entry';
import { MoodFace } from '../../ui/atoms/mood/mood';

const MOOD_GROUP_FACES: Record<number, MoodFace> = {
  1: 'very-happy',
  2: 'happy',
  3: 'neutral',
  4: 'sad',
  5: 'very-sad',
};

export interface EntryViewModel {
  id: number;
  date: Date;
  moodFace: MoodFace;
  moodColor: string;
  moodName: string;
  activities: EntryActivity[];
  note: string;
}

function parseLocalDate(localDate: string): Date {
  const [year, month, day] = localDate.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toEntryViewModel(entry: Entry): EntryViewModel {
  return {
    id: entry.id,
    date: parseLocalDate(entry.localDate),
    moodFace: entry.mood ? MOOD_GROUP_FACES[entry.mood.moodGroupId] : 'neutral',
    moodColor: entry.mood?.color ?? 'var(--mat-sys-primary)',
    moodName: entry.mood?.name ?? 'No mood',
    activities: entry.activities.map((activity) => ({ label: activity.name })),
    note: entry.note ?? '',
  };
}

@Component({
  selector: 'app-entries-list',
  imports: [EntryOrganism],
  templateUrl: './entries-list.html',
  styleUrl: './entries-list.scss',
})
export class EntriesList {
  private readonly entriesService = inject(EntriesService);

  protected readonly entries = toSignal(this.entriesService.list(), { initialValue: [] });
  protected readonly entryViewModels = computed(() => this.entries().map(toEntryViewModel));
}
