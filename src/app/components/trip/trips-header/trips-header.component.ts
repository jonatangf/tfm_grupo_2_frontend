import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { ISession } from '../../../interfaces/users/isession';

@Component({
  selector: 'app-trips-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './trips-header.component.html',
  styleUrl: './trips-header.component.css',
})
export class TripsHeaderComponent {
  userService = inject(UsersService);
  sesionData: ISession | null = {
    userId: -1,
    username: '',
    email: '',
    photo: '',
  };
  isProfileSidebarOpen: boolean = false;

  ngOnInit(): void {
    this.getSessionData();
  }

  getSessionData() {
    this.sesionData = this.userService.getSession();
  }

  //TODO: Abrir Sidebar del perfil
  toggleProfileSidebar(): void {
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
  }
}
