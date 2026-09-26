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

export interface ExportedMediaMonth {
  year: number;
  month: number;
}

export interface ExportedMedia {
  id: number;
  name: string;
  picture: string;
  type: 'GAME' | 'SERIE' | 'OTHER';
  zoom: number;
  focalX: number;
  focalY: number;
  months: ExportedMediaMonth[];
}

export interface DaylioBackup {
  tag_groups: DaylioTagGroup[];
  tags: DaylioTag[];
  customMoods: DaylioCustomMood[];
  dayEntries: DaylioDayEntry[];
  /** Only present in Daysktop's own exports; absent from real Daylio backups. */
  media?: ExportedMedia[];
}
