import { Component, input, output } from '@angular/core';
import { MenuButton } from '../../atoms/menu-button/menu-button';
import { Icon, IconName } from '../../atoms/icon/icon';
import { TextTile } from '../../layout/text-tile/text-tile';

export type MenubarItem = 'entries' | 'statistics' | 'calendar' | 'activities' | 'search' | 'settings';

interface MenubarEntry {
  id: MenubarItem;
  label: string;
  icon: IconName;
}

const MENUBAR_ENTRIES: MenubarEntry[] = [
  { id: 'entries', label: 'Entries', icon: 'list' },
  { id: 'statistics', label: 'Statistics', icon: 'chart-dots' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar-week' },
  { id: 'activities', label: 'Activities', icon: 'run' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

@Component({
  selector: 'app-menubar',
  imports: [MenuButton, Icon, TextTile],
  templateUrl: './menubar.html',
  styleUrl: './menubar.scss',
})
export class Menubar {
  readonly selected = input<MenubarItem>('entries');
  readonly width = input(480);
  readonly itemSelect = output<MenubarItem>();

  protected readonly entries = MENUBAR_ENTRIES;
}
