export type MediaType = 'GAME' | 'SERIE' | 'OTHER';

export interface MediaMonth {
  id: number;
  year: number;
  month: number;
}

export interface Media {
  id: number;
  name: string;
  picture: string;
  type: MediaType;
  months: MediaMonth[];
}
