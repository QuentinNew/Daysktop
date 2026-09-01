export interface DaylioTagGroup {
  id: number;
  name: string;
  order: number;
}

export interface DaylioTag {
  id: number;
  name: string;
  icon: number;
  order: number;
  state: number;
  id_tag_group: number;
}

export interface DaylioCustomMood {
  id: number;
  custom_name: string;
  mood_group_id: number;
  mood_group_order: number;
  icon_id: number;
  state: number;
}

export interface DaylioDayEntry {
  id: number;
  /** 0-indexed, like JS Date#getMonth() */
  month: number;
  day: number;
  year: number;
  datetime: number;
  mood: number;
  note: string;
  tags: number[];
  isFavorite: boolean;
}

export interface DaylioBackup {
  tag_groups: DaylioTagGroup[];
  tags: DaylioTag[];
  customMoods: DaylioCustomMood[];
  dayEntries: DaylioDayEntry[];
}
