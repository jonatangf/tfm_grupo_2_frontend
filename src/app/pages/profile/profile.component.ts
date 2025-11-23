import {
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { ISession } from '../../interfaces/users/isession';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/users/iuser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Output() close = new EventEmitter<void>();

  userService = inject(UsersService);
  sesionData!: ISession;
  user!: IUser;

  isEditing = false;
  editableUser: any;
  originalUser: any;
  showSaveButton = false;

  async ngOnInit(): Promise<void> {
    this.getSessionData();
    await this.getUser();
    // Clonamos el user para edición
    this.originalUser = { ...this.user };
    this.editableUser = { ...this.user };
  }

  getSessionData() {
    this.sesionData = this.userService.getSession()!;
  }

  async getUser() {
    this.user = await this.userService.getUserById(this.sesionData.userId);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Si cancelamos edición, volvemos al estado original
      this.editableUser = { ...this.originalUser };
      this.showSaveButton = false;
    }
  }

  //Cuando hacemos click activamos el elemento HTML oculto que es un input de tipo file
  onAvatarClick(input: HTMLInputElement) {
    input.click(); // dispara el diálogo de selección de archivo
  }

  async onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Subir imagen al servicio y obtener URL
      const uploadedUrl = await this.userService.uploadUserAvatar(file);

      // Guardar la URL en editableUser
      this.editableUser.photo = uploadedUrl;
      this.showSaveButton = true;
    }
  }

  async onSave() {
    try {
      // Intentamos actualizar en backend
      await this.userService.updateUserById(this.editableUser);

      // ✅ Si todo va bien:
      // - Actualizamos el original con lo que se ha guardado
      this.originalUser = { ...this.editableUser };
      this.isEditing = false;
      this.showSaveButton = false;

      // - Refrescamos el user desde backend para tener datos consistentes
      await this.getUser();

      this.close.emit();
    } catch (error) {
      // ❌ Si falla:
      // El interceptor ya muestra el snackbar, aquí solo revertimos el estado
      this.editableUser = { ...this.originalUser };
      this.isEditing = false;
      this.showSaveButton = false;
    }
  }

  onCancel() {
    this.close.emit();
  }

  ngDoCheck() {
    // Detecta si hay cambios respecto al original
    this.showSaveButton =
      this.isEditing &&
      (this.editableUser.email !== this.originalUser.email ||
        this.editableUser.interests !== this.originalUser.interests);
  }
}
