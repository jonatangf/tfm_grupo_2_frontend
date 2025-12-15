import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { ISession } from '../../../interfaces/users/isession';
import { ProfileComponent } from '../../../pages/profile/profile.component';

@Component({
  selector: 'app-trips-header',
  imports: [RouterLink, RouterLinkActive, ProfileComponent],
  templateUrl: './trips-header.component.html',
  styleUrl: './trips-header.component.css',
})
export class TripsHeaderComponent implements OnInit {
  userService = inject(UsersService);
  sesionData: ISession | null = {
    userId: -1,
    username: '',
    email: '',
    photo: '',
  };
  isProfileSidebarOpen: boolean = false;

  router = inject(Router);
  ngOnInit(): void {
    this.getSessionData();
  }

  getSessionData() {
    this.sesionData = this.userService.getSession();
  }

  toggleProfileSidebar(): void {
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
  }

  // Si ya estamos en /trips, evitar que el router haga navegación y refrescar
  goToTrips(event: Event) {
    if (this.router.url === '/trips') {
      event.preventDefault();
      window.location.reload();
    }
  }

  onAvatarUpdated(url: string | null) {
    this.userService.setSessionPhoto(url!);
    this.sesionData = this.userService.getSession();
  }
}
