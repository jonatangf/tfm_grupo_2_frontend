
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
export class ProfileComponent implements OnInit, DoCheck, OnDestroy {
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
    console.log(this.countries)
    await this.loadInterests();
    console.log(this.allInterests)
    await this.loadUserInterests();
    console.log(this.userInterest)
    // Si tienes API de interests, podrías hacer:
    // this.interests = await this.interestsService.getInterests();

    
  // ...setValue inicial
  // NO pongas [disabled] en el template; controla aquí:
  if (this.isEditing) {
    this.interestsCtrl.enable({ emitEvent: false });
  } else {
    this.interestsCtrl.disable({ emitEvent: false });
  }

    // Normaliza ambos modelos a mismo shape
    const base = this.normalizeUser(this.user);

    this.originalUser = { ...base };
    this.editableUser = { ...base };

    // Preselecciona chips a string[]
    const selectedIdsStr = (this.originalUser.interests as number[]).map((id) =>
      id.toString()
    );

    // Set inicial sin emitir eventos
    Promise.resolve().then(() => {
      this.interestsCtrl.setValue(selectedIdsStr, { emitEvent: false });
      // Asegura que NO responden si no estás en edición
      this.interestsCtrl.disable({ emitEvent: false });
    });

    // Suscripción para marcar cambios solo en edición
    const sub = this.interestsCtrl.valueChanges.subscribe(() => {
      // NgDoCheck hará la comparación robusta; aquí, si quieres, puedes “forzar” re-evaluación.
      // Solo marcamos la intención de cambio cuando se está editando.
      if (this.isEditing) {
        // No ponemos showSaveButton = true a ciegas: dejamos que ngDoCheck decida.
        // Pero este evento ya desencadena detección en la vista.
      }
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

      // Mantén el shape normalizado en originalUser
      this.originalUser = {
        ...this.originalUser,
        ...this.normalizeUser(payload),
      };

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
  ngDoCheck() {
    if (!this.dataReady) {
      this.showSaveButton = false;
      return;
    }

    const emailChanged =
      this.normStr(this.editableUser.email) !==
      this.normStr(this.originalUser.email);

    const descriptionChanged =
      this.normStr(this.editableUser.description) !==
      this.normStr(this.originalUser.description);

    const countryChanged =
      this.normNumOrNull(this.editableUser.countries_id) !==
      this.normNumOrNull(this.originalUser.countries_id);

    const birthdateChanged =
      this.normDateStr(this.editableUser.birthdate) !==
      this.normDateStr(this.originalUser.birthdate);

    const phoneChanged =
      this.normStr(this.editableUser.telephone) !==
      this.normStr(this.originalUser.telephone);

    // Intereses: compara number[] (original) vs string[] (control)
    const interestsCurrent: string[] = this.interestsCtrl.value ?? [];
    const interestsOriginal: number[] = Array.isArray(this.originalUser.interests)
      ? this.originalUser.interests
      : [];

    const interestsChanged = !this.arraysEqualAsNumbers(
      interestsCurrent,
      interestsOriginal
    );

    this.showSaveButton =
      this.isEditing &&
      (emailChanged ||
        descriptionChanged ||
        countryChanged ||
        birthdateChanged ||
        phoneChanged ||
        interestsChanged);
  }

  
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

  // Normalizadores consistentes
  private normStr(s?: string | null): string {
    return (s ?? '').toString().trim();
  }

  private normNumOrNull(n?: number | string | null): number | null {
    if (n === undefined || n === null || n === '') return null;
    const num = Number(n);
    return Number.isNaN(num) ? null : num;
  }

  private normDateStr(d?: string | Date | null): string | null {
    if (!d) return null;
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d; // ya normalizada
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private toInterestIds(arr: any[] | undefined | null): number[] {
    return (arr ?? [])
      .map((i: any) => (typeof i === 'object' ? Number(i.id) : Number(i)))
      .filter((n) => !Number.isNaN(n));
  }

  private normalizeUser(u: any) {
    // Devuelve el shape homogenizado para original/editable
    const interestsNorm =
      this.toInterestIds(u?.interests) || this.userInterest.map((i) => i.id);
    return {
      id: u?.id,
      email: this.normStr(u?.email),
      description: this.normStr(u?.description),
      countries_id: this.normNumOrNull(u?.countries_id), // null si no hay
      birthdate: this.normDateStr(u?.birthdate), // 'YYYY-MM-DD' o null
      telephone: this.normStr(u?.telephone),
      interests: interestsNorm, // number[]
      photo: u?.photo ?? null,
    };
  }

  arraysEqualAsNumbers(a: string[] | number[], b: number[]): boolean {
    const toNum = (x: any) => Number(x);
    const an = (a ?? [])
      .map(toNum)
      .filter((n) => !Number.isNaN(n))
      .sort((x, y) => x - y);
    const bn = (b ?? [])
      .map(toNum)
      .filter((n) => !Number.isNaN(n))
      .sort((x, y) => x - y);
    if (an.length !== bn.length) return false;
    for (let i = 0; i < an.length; i++) {
      if (an[i] !== bn[i]) return false;
    }
    return true;
  }
}
