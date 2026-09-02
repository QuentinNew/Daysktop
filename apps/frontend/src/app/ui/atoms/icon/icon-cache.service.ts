import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import type { IconName } from './icon';

@Injectable({ providedIn: 'root' })
export class IconCacheService {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly cache = new Map<IconName, Promise<SafeHtml>>();

  getIcon(name: IconName): Promise<SafeHtml> {
    let icon = this.cache.get(name);
    if (!icon) {
      icon = firstValueFrom(
        this.http.get(`icons/${name}.svg`, { responseType: 'text' }),
      ).then((raw) => this.sanitizer.bypassSecurityTrustHtml(raw));
      this.cache.set(name, icon);
    }
    return icon;
  }
}
