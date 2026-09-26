import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly http = inject(HttpClient);

  exportBackup(): Observable<Blob> {
    return this.http.get('/api/export', { responseType: 'blob' });
  }
}
