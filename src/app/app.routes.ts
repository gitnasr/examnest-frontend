import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'auth',
        loadComponent: () => import('./features/auth/auth/auth.component').then(m => m.AuthComponent)
    }
];
