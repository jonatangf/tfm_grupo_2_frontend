import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-trips-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './trips-header.component.html',
  styleUrl: './trips-header.component.css',
})
export class TripsHeaderComponent {

    isProfileSidebarOpen: boolean = false;

    //Abrir Sidebar del perfil
    toggleProfileSidebar(): void{
        this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
    }
}
