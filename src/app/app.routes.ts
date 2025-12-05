import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./popup/popup').then((m) => m.Popup),
  },
];
