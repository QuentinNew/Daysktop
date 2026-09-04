import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Entry } from './entry.model';

@Injectable({ providedIn: 'root' })
export class EntriesService {
  private readonly http = inject(HttpClient);

  private readonly entries$: Observable<Entry[]> = this.http
    .get<Entry[]>('/api/entries')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  list(): Observable<Entry[]> {
    return this.entries$;
  }
}
