import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Media, MediaType } from './media.model';

export interface MediaInput {
  name: string;
  picture: string;
  type: MediaType;
  zoom: number;
  focalX: number;
  focalY: number;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);

  list(): Observable<Media[]> {
    return this.http.get<Media[]>('/api/media');
  }

  create(input: MediaInput): Observable<Media> {
    return this.http.post<Media>('/api/media', input);
  }

  update(id: number, input: MediaInput): Observable<Media> {
    return this.http.patch<Media>(`/api/media/${id}`, input);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`/api/media/${id}`);
  }

  assignMonth(id: number, year: number, month: number): Observable<Media> {
    return this.http.post<Media>(`/api/media/${id}/months`, { year, month });
  }

  unassignMonth(id: number, year: number, month: number): Observable<Media> {
    return this.http.delete<Media>(`/api/media/${id}/months/${year}/${month}`);
  }
}
