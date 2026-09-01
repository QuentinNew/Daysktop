import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'entries' },
  {
    path: 'entries',
    loadComponent: () => import('./entries/entries-list/entries-list').then((m) => m.EntriesList),
  },
];
