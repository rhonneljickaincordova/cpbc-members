import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'my-attendance',
    loadComponent: () => import('./components/member-lookup/member-lookup').then((m) => m.MemberLookup),
  },
  {
    path: 'record-attendance',
    loadComponent: () => import('./components/record-attendance/record-attendance').then((m) => m.RecordAttendance),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'members',
        loadComponent: () => import('./components/members/members').then((m) => m.Members),
      },
      {
        path: 'teams',
        loadComponent: () => import('./components/teams/teams').then((m) => m.Teams),
      },
      {
        path: 'attendance',
        loadComponent: () => import('./components/attendance/attendance').then((m) => m.Attendance),
      },
      {
        path: 'payments',
        loadComponent: () => import('./components/payments/payments').then((m) => m.Payments),
      },
      {
        path: 'member-lookup',
        loadComponent: () => import('./components/member-lookup/member-lookup').then((m) => m.MemberLookup),
        data: { embedded: true },
      },
    ],
  },
];
