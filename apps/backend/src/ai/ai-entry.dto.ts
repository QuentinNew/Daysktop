import type { Activity, Entry, Mood } from '@prisma/client';

export interface AiEntry {
  date: string;
  note: string | null;
  mood: string | null;
  activities: string[];
  isFavorite: boolean;
}

type EntryWithRelations = Entry & { mood: Mood | null; activities: Activity[] };

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toAiEntry(entry: EntryWithRelations): AiEntry {
  return {
    date: toIsoDate(entry.localDate),
    note: entry.note,
    mood: entry.mood?.name ?? null,
    activities: entry.activities.map((activity) => activity.name),
    isFavorite: entry.isFavorite,
  };
}
