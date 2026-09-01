import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Entry } from './entry.model';

@Injectable({ providedIn: 'root' })
export class EntriesService {
  private readonly http = inject(HttpClient);

  list(): Observable<Entry[]> {
    return this.http.get<Entry[]>('/api/entries');
  }
}
