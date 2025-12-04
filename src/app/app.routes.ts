import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { ForumComponent } from './pages/forum/forum.component';
import { loginGuard } from './guards/login-guard';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },

  // Rutas protegidas
  { path: 'profile', component: ProfileComponent, canActivate: [loginGuard] },
  { path: 'trips', component: TripListComponent, canActivate: [loginGuard] },
  { path: 'forum', component: ForumComponent, canActivate: [loginGuard] },
  { path: 'forum/:tripId', component: ForumComponent, canActivate: [loginGuard] },


  //Rutas de errores
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '404'},
];

