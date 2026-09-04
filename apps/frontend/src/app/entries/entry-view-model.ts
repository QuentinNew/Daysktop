import { Entry } from './entry.model';
import { EntryActivity } from '../ui/organisms/entry/entry';
import { MoodFace } from '../ui/atoms/mood/mood';

export const MOOD_GROUP_FACES: Record<number, MoodFace> = {
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

export function parseLocalDate(localDate: string): Date {
  const [year, month, day] = localDate.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toEntryViewModel(entry: Entry): EntryViewModel {
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
