import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trips/trip-detail/trip-detail.component';
import { TripFormComponent } from './pages/trips/trip-form/trip-form.component';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // Rutas protegidas
  { path: 'profile', component: ProfileComponent, canActivate: [loginGuard] },
  { path: 'trips', component: TripListComponent, canActivate: [loginGuard] },
  { path: 'trips/:idTrip', component: TripDetailComponent, canActivate: [loginGuard] },
  { path: 'newTrip', component: TripFormComponent, canActivate: [loginGuard] },
  { path: 'updateTrip/:idTrip', component: TripDetailComponent, canActivate: [loginGuard] },

  { path: '**', redirectTo: 'home' },
];

