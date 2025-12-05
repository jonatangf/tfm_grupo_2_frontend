
// profile.component.ts
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  DoCheck,
  OnDestroy,
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

// 🔧 Ajusta estas rutas a las de tu proyecto
import { ISession } from '../../interfaces/users/isession';
import { IUser } from '../../interfaces/users/iuser';
import { ICountry } from '../../interfaces/icountry.interface';
import { IInterest } from '../../interfaces/iInterest.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatChipsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit,  OnDestroy {
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

  isEditing = false;
  dataReady = false;

  // Estado editable vs original (mismo shape normalizado)
  editableUser: any = { interests: [] as number[] };
  originalUser: any = { interests: [] as number[] };

  showSaveButton = false;

  // Chips: control reactivo (string[] porque MatChips trabaja con strings)
  interestsCtrl = new FormControl<string[]>({ value: [], disabled: true }, { nonNullable: true })

  // Demo: listado de intereses (si no los cargas de API)
  /*allInterests: { id: number; name: string }[] = [
    { id: 1, name: 'Viajes' },
    { id: 2, name: 'Gastronomía' },
    { id: 3, name: 'Deporte' },
    { id: 4, name: 'Tecnología' },
    { id: 5, name: 'Arte' },
    { id: 6, name: 'Música' },
  ];*/

  // Fallback si el usuario no trae intereses
  /*userInterest: { id: number; name: string }[] = [
    { id: 1, name: 'Viajes' },
    { id: 3, name: 'Deporte' },
    { id: 6, name: 'Música' },
  ];*/

  private subs: { unsubscribe: () => void }[] = [];


async ngOnInit(): Promise<void> {
  this.getSessionData();
  await this.getUser();
  await this.loadCountries();
  await this.loadInterests();
  await this.loadUserInterests();

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
    photo: this.user.photo ?? null,
  };

  console.log(this.originalUser)

  this.editableUser = { ...this.originalUser };

  // Chips
  const selectedIdsStr = (this.originalUser.interests as number[]).map((id) => id.toString());
  this.interestsCtrl.setValue(selectedIdsStr, { emitEvent: false });

  // Habilita/deshabilita según edición
  if (this.isEditing) {
    this.interestsCtrl.enable({ emitEvent: false });
  } else {
    this.interestsCtrl.disable({ emitEvent: false });
  }

  // Suscripción (opcional, solo UI)
  const sub = this.interestsCtrl.valueChanges.subscribe(() => {
    // no necesitamos marcar cambios si el botón guardar siempre aparece en edición
  });
  this.subs.push(sub);

  this.dataReady = true;
}


  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe?.());
  }

  // ========= CARGA DE DATOS =========
  getSessionData() {
    this.sesionData = this.userService.getSession()!;
  }

  async getUser() {
    this.user = await this.userService.getUserById(this.sesionData.userId);
    console.log(this.user)
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

  onCancel() {
    this.close.emit();
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


      // Sal de edición y deshabilita chips
      this.isEditing = false;
      this.interestsCtrl.disable({ emitEvent: false });
      this.showSaveButton = false;

      // (Opcional) Recarga user del servidor si necesitas datos calculados
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
    this.showSaveButton = false;

    // Feedback
    this.snackBar.open('Edición cancelada', 'Cerrar', {
      duration: 2000,
      panelClass: ['info-snackbar'],
    });
  }

  // ========= HELPERS =========
  private showSuccessToast() {
    this.snackBar.open(`¡Perfil editado! 🙂`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
}
