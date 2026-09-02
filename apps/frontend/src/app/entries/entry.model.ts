export interface Mood {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  moodGroupId: number;
}

export interface Activity {
  id: number;
  name: string;
  icon: string | null;
}

export interface Entry {
  id: number;
  localDate: string;
  note: string | null;
  isFavorite: boolean;
  mood: Mood | null;
  activities: Activity[];
}
