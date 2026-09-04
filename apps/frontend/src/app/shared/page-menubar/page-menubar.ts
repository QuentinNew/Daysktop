import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Menubar, MenubarItem } from '../../ui/molecules/menubar/menubar';

const ROUTES: Partial<Record<MenubarItem, string>> = {
  entries: '/entries',
  calendar: '/calendar',
  settings: '/settings',
};

@Component({
  selector: 'app-page-menubar',
  imports: [Menubar],
  templateUrl: './page-menubar.html',
  styleUrl: './page-menubar.scss',
})
export class PageMenubar {
  private readonly router = inject(Router);

  protected readonly selected = (this.router.url.split('/')[1] || 'entries') as MenubarItem;

  protected onItemSelect(item: MenubarItem): void {
    const path = ROUTES[item];
    if (path) {
      this.router.navigateByUrl(path);
    }
  }
}
