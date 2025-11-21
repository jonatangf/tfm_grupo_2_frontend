import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },

  // Rutas protegidas
  { path: 'profile', component: ProfileComponent, canActivate: [loginGuard] },
  { path: 'trips', component: TripListComponent, canActivate: [loginGuard] },

  { path: '**', redirectTo: 'home' },
];

