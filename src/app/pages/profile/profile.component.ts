import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { ISession } from '../../interfaces/users/isession';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input() user: ISession | null = null;
  @Output() close = new EventEmitter<void>();

  onSave() {
    // Aquí llamas al servicio de usuarios para actualizar datos
    // this.userService.updateUser(this.user)
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }
}
