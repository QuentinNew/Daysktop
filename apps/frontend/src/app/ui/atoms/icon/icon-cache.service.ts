import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import type { IconFolder } from './icon';

@Injectable({ providedIn: 'root' })
export class IconCacheService {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly cache = new Map<string, Promise<SafeHtml>>();

  getIcon(folder: IconFolder, name: string): Promise<SafeHtml> {
    const key = `${folder}/${name}`;
    let icon = this.cache.get(key);
    if (!icon) {
      icon = firstValueFrom(this.http.get(`${key}.svg`, { responseType: 'text' })).then((raw) =>
        this.sanitizer.bypassSecurityTrustHtml(raw),
      );
      this.cache.set(key, icon);
    }
    return icon;
  }
}
