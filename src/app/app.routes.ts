import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TripListComponent } from './pages/trips/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trips/trip-detail/trip-detail.component';
import { TripFormComponent } from './pages/trips/trip-form/trip-form.component';
export const routes: Routes = [
    {path: "", pathMatch: 'full', redirectTo: 'home'},
    {path: "home", component: HomeComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "profile", component: ProfileComponent},
    {path: "trips", component: TripListComponent},
    {path: "trips/:idTrip", component: TripDetailComponent},
    {path: "newTrip", component: TripFormComponent},
    {path: "updateTrip/:idTrip", component: TripDetailComponent},
    {path: "**", redirectTo:'home'}
];
