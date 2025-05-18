import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'start-page', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard] },
    { path: 'start-page', loadComponent: () => import('./start-page/start-page.component').then((c) => c.StartPageComponent), canActivate: [authGuard] },
    { path: 'admin-mode', loadComponent: () => import('./admin-mode/admin-mode.component').then((c) => c.AdminModeComponent), canActivate: [authGuard] },
    { path: 'user-page', loadComponent: () => import('./user-page/user-page.component').then((c) => c.UserPageComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: 'start-page' }
];
