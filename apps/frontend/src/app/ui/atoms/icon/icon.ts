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
  | 'circle-x'
  | 'pencil';

export type ActivityIconName =
  | 'balloon'
  | 'bed'
  | 'book-2'
  | 'book'
  | 'books'
  | 'brain'
  | 'briefcase-2'
  | 'building-fortress'
  | 'calendar'
  | 'chalkboard'
  | 'clock'
  | 'cloud-bolt'
  | 'cloud'
  | 'confetti'
  | 'cookie-man'
  | 'device-gamepad-2'
  | 'device-laptop'
  | 'device-tv'
  | 'device-workstation'
  | 'dice-3'
  | 'droplets'
  | 'sign-right'
  | 'first-aid-kit'
  | 'glass-full'
  | 'grill'
  | 'hammer'
  | 'heart-handshake'
  | 'heart'
  | 'hearts'
  | 'home'
  | 'leaf-maple'
  | 'list-check'
  | 'masks-theater'
  | 'mountain'
  | 'movie'
  | 'palette'
  | 'phone'
  | 'plunger'
  | 'pointer'
  | 'printer'
  | 'puzzle'
  | 'run'
  | 'shopping-cart'
  | 'stairs'
  | 'stethoscope'
  | 'sun'
  | 'sunset-2'
  | 'tank'
  | 'teapot'
  | 'thinking-medium'
  | 'thumb-up'
  | 'tie'
  | 'train'
  | 'tree'
  | 'user-question'
  | 'users'
  | 'wash-dry-1'
  | 'zzz-off'
  | 'zzz'
  | 'circle-dashed-x';

export const ACTIVITY_ICON_NAMES: ActivityIconName[] = [
  'balloon',
  'bed',
  'book-2',
  'book',
  'books',
  'brain',
  'briefcase-2',
  'building-fortress',
  'calendar',
  'chalkboard',
  'clock',
  'cloud-bolt',
  'cloud',
  'confetti',
  'cookie-man',
  'device-gamepad-2',
  'device-laptop',
  'device-tv',
  'device-workstation',
  'dice-3',
  'droplets',
  'sign-right',
  'first-aid-kit',
  'glass-full',
  'grill',
  'hammer',
  'heart-handshake',
  'heart',
  'hearts',
  'home',
  'leaf-maple',
  'list-check',
  'masks-theater',
  'mountain',
  'movie',
  'palette',
  'phone',
  'plunger',
  'pointer',
  'printer',
  'puzzle',
  'run',
  'shopping-cart',
  'stairs',
  'stethoscope',
  'sun',
  'sunset-2',
  'tank',
  'teapot',
  'thinking-medium',
  'thumb-up',
  'tie',
  'train',
  'tree',
  'user-question',
  'users',
  'wash-dry-1',
  'zzz-off',
  'zzz',
];

export type IconFolder = 'icons' | 'activity';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  /** @ignore */
  private readonly iconCache = inject(IconCacheService);

  readonly name = input.required<IconName | ActivityIconName>();
  readonly folder = input<IconFolder>('icons');
  readonly size = input(20);

  /** @ignore */
  protected readonly svg = resource({
    params: () => ({ folder: this.folder(), name: this.name() }),
    loader: ({ params }) => this.iconCache.getIcon(params.folder, params.name),
  });
}
