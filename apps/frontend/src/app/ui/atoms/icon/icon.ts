import { Component, inject, input, resource } from '@angular/core';
import { IconCacheService } from './icon-cache.service';

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'calendar-week'
  | 'chart-dots'
  | 'list'
  | 'run'
  | 'search'
  | 'settings'
  | 'circle-check'
  | 'circle-x';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  /** @ignore */
  private readonly iconCache = inject(IconCacheService);

  readonly name = input.required<IconName>();
  readonly size = input(20);

  /** @ignore */
  protected readonly svg = resource({
    params: () => this.name(),
    loader: ({ params }) => this.iconCache.getIcon(params),
  });
}
