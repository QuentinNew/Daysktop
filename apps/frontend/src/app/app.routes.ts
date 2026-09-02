import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'entries' },
  {
    path: 'entries',
    loadComponent: () => import('./entries/entries-list/entries-list').then((m) => m.EntriesList),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar-page/calendar-page').then((m) => m.CalendarPage),
  },
];
