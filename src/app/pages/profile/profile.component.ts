import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { CountriesService } from '../../services/countries.service';
import { InterestsService } from '../../services/interests.service';

import { ISession } from '../../interfaces/users/isession';
import { IUser } from '../../interfaces/users/iuser';
import { ICountry } from '../../interfaces/icountry.interface';
import { IInterest } from '../../interfaces/iInterest.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatChipsModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  userService = inject(UsersService);
  countriesService = inject(CountriesService);
  interestsService = inject(InterestsService);

  sesionData!: ISession;
  user!: IUser;
  countries!: ICountry[];
  interests!: IInterest[];
  allInterests!: IInterest[];
  userInterest!: IInterest[];

  userCountry: string = "";
  isEditing = false;
  dataReady = false;
  showAllInterests = false;
  showSaveButton = false; 
  truncatedDescription = '';
  showExpandLink = false;
  fullDescriptionVisible = false;
  private interestMap = new Map<number, IInterest>();

  // Estado editable vs original (mismo shape normalizado)
  editableUser: any = { interests: [] as number[] };
  originalUser: any = { interests: [] as number[] };

  // Chips: control reactivo (string[] porque MatChips trabaja con strings)
  interestsCtrl = new FormControl<string[]>({ value: [], disabled: true }, { nonNullable: true })


async ngOnInit(): Promise<void> {
  this.getSessionData();
  await this.getUser();
  await this.loadCountries();
  await this.loadInterests();
  await this.loadUserInterests();

  
  // Construye el mapa para búsquedas rápidas
  (this.allInterests ?? []).forEach(i => this.interestMap.set(i.id, i));
  // Inicializa modelos a partir de user + userInterest
  const interestsFromUser =
    Array.isArray(this.user?.interests) && this.user.interests.length
      ? this.user.interests.map((i: any) => (typeof i === 'object' ? Number(i.id) : Number(i)))
      : (this.userInterest ?? []).map(i => Number(i.id));

  this.originalUser = {
    id: this.user.id,
    email: this.user.email ?? '',
    description: this.user.description ?? '',
    countries_id: this.user.countries_id ?? null,
    birthdate: this.user.birthdate ?? null,
    telephone: this.user.telephone ?? '',
    interests: interestsFromUser,
    avatar: this.user.avatar ?? null,
  };

  this.editableUser = { ...this.originalUser };

  //truncado descripcion
  this.updateDescriptionView();

  //pais user
  const country = this.countries.find(c => c.id === this.editableUser.countries_id);
  this.userCountry = country?.name ?? 'La Tierra';


  // Inicializa chips (string[])
  const selectedIdsStr = interestsFromUser.map(id => id.toString());
  this.interestsCtrl.setValue(selectedIdsStr, { emitEvent: false });

  // Habilita/deshabilita según edición
  if (this.isEditing) {
    this.interestsCtrl.enable({ emitEvent: false });
  } else {
    this.interestsCtrl.disable({ emitEvent: false });
  }
  this.dataReady = true;
}

  // ========= CARGA DE DATOS =========
  getSessionData() {
    this.sesionData = this.userService.getSession()!;
  }
  async getUser() {
    this.user = await this.userService.getUserById(this.sesionData.userId);
  }
  async loadCountries() {
    this.countries = await this.countriesService.getCountries();
  }
  async loadInterests() {
    this.allInterests = await this.interestsService.getInterests();
  }
  async loadUserInterests(){
    this.userInterest = await this.userService.getInterests(this.sesionData.userId);
  }

  // ========= UI / EDICIÓN =========
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Entra en edición: habilita chips
      this.interestsCtrl.enable({ emitEvent: false });
      this.showSaveButton = false;
    } else {
      // Sale de edición: restaura y deshabilita chips
      this.editableUser = { ...this.originalUser };

      const origIdsStr = (this.originalUser?.interests ?? []).map((id: number) =>
        id.toString()
      );
      this.interestsCtrl.setValue(origIdsStr, { emitEvent: false });
      this.interestsCtrl.disable({ emitEvent: false });

      this.showSaveButton = false;
    }
  }

  // ========= AVATAR =========
  onAvatarClick(input: HTMLInputElement) {
    if (!this.isEditing) return; // evita subir avatar fuera de edición
    input.click();
  }

  async onAvatarSelected(event: Event) {
    if (!this.isEditing) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const uploadedUrl = await this.userService.uploadUserAvatar(
        this.sesionData.userId,
        file
      );
      this.editableUser.photo = uploadedUrl;
      this.showSaveButton = true;
    }
  }

  // ========= GUARDADO =========
  async onSave() {
    try {
      // Convierte chips string[] -> number[]
      const interestsIds: number[] = (this.interestsCtrl.value ?? []).map((id) =>
        parseInt(id, 10)
      );
      const payload = {
        ...this.editableUser,
        interests: interestsIds, // number[]
      };

      await this.userService.updateUserById(payload);

      // Sale de edición y deshabilita chips
      this.isEditing = false;
      this.interestsCtrl.disable({ emitEvent: false });
      this.showSaveButton = false;

      // Recarga user del servidor 
      await this.getUser();

      this.showSuccessToast();
      this.close.emit();
    } catch (error) {
      // Revertir al original
      this.editableUser = { ...this.originalUser };

      const origIdsStr = (this.originalUser?.interests ?? []).map((id: number) =>
        id.toString()
      );
      this.interestsCtrl.setValue(origIdsStr, { emitEvent: false });
      this.interestsCtrl.disable({ emitEvent: false });

      this.isEditing = false;
      this.showSaveButton = false;
    }
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }

  // ========= DETECCIÓN DE CAMBIOS =========

  // Entrar en edición (lápiz)
  enterEdit(): void {
    if (this.isEditing) return;
    this.isEditing = true;
    this.interestsCtrl.enable({ emitEvent: false });
    this.showAllInterests = false; // comienza colapsado
    this.showSaveButton = false;
  }

  // Cancelar edición (círculo con barra): restaura todo
  cancelEdit(): void {
    if (!this.isEditing) return;
    // Restaura editable al original
    this.editableUser = { ...this.originalUser };
    // Re-sincroniza chips
    const origIdsStr = (this.originalUser?.interests ?? []).map((id: number) => id.toString());
    this.interestsCtrl.setValue(origIdsStr, { emitEvent: false });
    this.interestsCtrl.disable({ emitEvent: false });
    // Limpia estado
    this.isEditing = false;
    this.showAllInterests = false;
    this.showSaveButton = false;
    // Feedback
    this.snackBar.open('Edición cancelada', 'Cerrar', {
      duration: 2000,
      panelClass: ['info-snackbar'],
    });
  }


onCloseClick(): void {
  // Si cerramos desde modo edición, confirmamacion de descarte
  if (this.isEditing) {
    const confirmClose = window.confirm('Hay cambios sin guardar. ¿Quieres cerrar igualmente?');
    if (!confirmClose) return;
    this.cancelEdit();
  }
  // Emite el cierre
  this.close.emit();
}

  /** Intereses seleccionados (como objetos) para mostrar SOLO los del usuario */
  get selectedInterests(): IInterest[] {
    const ids = (this.interestsCtrl.value ?? []).map(v => parseInt(v, 10));
    return ids
      .map(id => this.interestMap.get(id))
      .filter((x): x is IInterest => !!x);
  }


updateDescriptionView() {
  const desc = this.editableUser.description || '';
  if (desc.length > 30 && !this.fullDescriptionVisible) {
    this.truncatedDescription = desc.slice(0, 30);
    this.showExpandLink = true;
  } else {
    this.truncatedDescription = desc;
    this.showExpandLink = false;
  }
}

toggleDescription() {
  this.fullDescriptionVisible = !this.fullDescriptionVisible;
  this.updateDescriptionView();
}

  // ========= HELPERS =========
  private showSuccessToast() {
    this.snackBar.open(`¡Perfil editado! 🙂`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
}
