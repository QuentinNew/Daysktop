import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Mood } from '../entries/entry.model';

@Injectable({ providedIn: 'root' })
export class MoodsService {
  private readonly http = inject(HttpClient);

  private readonly moods$: Observable<Mood[]> = this.http
    .get<Mood[]>('/api/moods')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  list(): Observable<Mood[]> {
    return this.moods$;
  }

  update(id: number, changes: { name?: string; color?: string }): Observable<Mood> {
    return this.http.patch<Mood>(`/api/moods/${id}`, changes);
  }
}
