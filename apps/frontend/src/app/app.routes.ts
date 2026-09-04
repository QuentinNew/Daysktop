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
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings-page/settings-page').then((m) => m.SettingsPage),
  },
  {
    path: 'activities',
    loadComponent: () =>
      import('./activities/activities-page/activities-page').then((m) => m.ActivitiesPage),
  },
];
