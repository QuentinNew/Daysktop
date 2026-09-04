import { Component, computed, input } from '@angular/core';
import { TextTile } from '../../layout/text-tile/text-tile';
import { Icon, IconName } from '../../atoms/icon/icon';

export type NotificationVariant = 'success' | 'error';

const VARIANT_COLOR: Record<NotificationVariant, string> = {
  success: 'var(--mat-sys-primary)',
  error: '#e66442',
};

const VARIANT_ICON: Record<NotificationVariant, IconName> = {
  success: 'circle-check',
  error: 'circle-x',
};

@Component({
  selector: 'app-notification',
  imports: [TextTile, Icon],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification {
  readonly variant = input<NotificationVariant>('success');
  readonly title = input.required<string>();
  readonly subtext = input('');
  readonly width = input(420);

  protected readonly color = computed(() => VARIANT_COLOR[this.variant()]);
  protected readonly icon = computed(() => VARIANT_ICON[this.variant()]);
}
