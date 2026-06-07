import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/clients/clients').then((m) => m.Clients),
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/clients').then((m) => m.Clients),
      },
      {
        path: 'barbers',
        loadComponent: () => import('./features/barbers/barbers').then((m) => m.Barbers),
      },
      {
        path: 'services',
        loadComponent: () => import('./features/services/services').then((m) => m.Services),
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/appointments/appointments').then((m) => m.Appointments),
      },
      {
        path: 'barbers/:id/schedules',
        loadComponent: () => import('./features/schedules/schedules').then((m) => m.Schedules),
      },
      {
        path: 'barbers/:id/overrides',
        loadComponent: () => import('./features/overrides/overrides').then((m) => m.Overrides),
      },
      {
        path: 'change-password',
        loadComponent: () => import('./features/auth/change-password/change-password').then((m) => m.ChangePassword),
      },
    ],
  },
];
