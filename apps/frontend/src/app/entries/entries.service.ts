import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Entry } from './entry.model';

export interface EntriesSearchFilters {
  keyword?: string;
  activityIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class EntriesService {
  private readonly http = inject(HttpClient);

  private readonly entries$: Observable<Entry[]> = this.http
    .get<Entry[]>('/api/entries')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  list(): Observable<Entry[]> {
    return this.entries$;
  }

  search(filters: EntriesSearchFilters): Observable<Entry[]> {
    let params = new HttpParams();
    if (filters.keyword) {
      params = params.set('keyword', filters.keyword);
    }
    if (filters.activityIds && filters.activityIds.length > 0) {
      params = params.set('activities', filters.activityIds.join(','));
    }
    return this.http.get<Entry[]>('/api/entries', { params });
  }
}
