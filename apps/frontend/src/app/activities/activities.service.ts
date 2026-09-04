import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ActivityGroup {
  id: number;
  name: string;
}

export interface ActivityWithGroup {
  id: number;
  name: string;
  icon: string | null;
  group: ActivityGroup;
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  private readonly http = inject(HttpClient);

  list(): Observable<ActivityWithGroup[]> {
    return this.http.get<ActivityWithGroup[]>('/api/activities');
  }

  update(id: number, changes: { name?: string; icon?: string }): Observable<ActivityWithGroup> {
    return this.http.patch<ActivityWithGroup>(`/api/activities/${id}`, changes);
  }
}
