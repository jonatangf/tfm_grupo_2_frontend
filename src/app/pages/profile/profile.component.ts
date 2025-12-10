import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UsersService } from '../../services/users.service';
import { CountriesService } from '../../services/countries.service';
import { InterestsService } from '../../services/interests.service';

import { IInterest } from '../../interfaces/iInterest.interface';
import { DateSinglePipe } from '../../utils/date-format.pipe';

// Utils (ajusta la ruta base: 'src/app/7utils' o similar)
import {buildInterestMap,pickInterestsByIds,} from '../../utils/interests';
import {numberIdsToStrings,stringsIdsToNumbers} from '../../utils/array';
import { isAllowedImage, getImageSize } from '../../utils/image';
import { truncate, sanitizeDescription as sanitizeDescUtil } from '../../utils/string';
import { toDateInputFormat } from '../../utils/date';
import { normalizeAvatarPath } from '../../utils/path';
import {
  setControlValueSilently,
  enableSilently,
  disableSilently,
} from '../../utils/forms';

import {
  PHONE_ALLOWED_REGEX,
  MAX_PHONE_LEN,
  MAX_DESCRIPTION_LEN,
  DESCRIPTION_ALLOWED_REGEX,
  ALLOWED_MIME,
  ALLOWED_EXT,
  MIN_WIDTH,
  MIN_HEIGHT,
  MAX_AVATAR_BYTES,
} from '../../utils/constants';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatChipsModule, DateSinglePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  // Constantes de validacion
  readonly MAX_PHONE_LEN = MAX_PHONE_LEN;
  readonly MAX_DESCRIPTION_LEN = MAX_DESCRIPTION_LEN;
  readonly PHONE_ALLOWED_REGEX = PHONE_ALLOWED_REGEX;
  readonly DESCRIPTION_ALLOWED_REGEX = DESCRIPTION_ALLOWED_REGEX;
  readonly MIN_WIDTH = MIN_WIDTH;
  readonly MIN_HEIGHT = MIN_HEIGHT;
  readonly MAX_AVATAR_BYTES = MAX_AVATAR_BYTES;

  // Estado de la pantalla
  userCountry: string = '';
  isEditing = false;
  dataReady = false;
  showAllInterests = false;
  showSaveButton = false;
  truncatedDescription = '';
  showExpandLink = false;
  fullDescriptionVisible = false;

  // Datos cargados
  sesionData!: { userId: number; [k: string]: any };
  user: any;
  countries: any[] = [];
  allInterests: IInterest[] = [];
  userInterest: { id: number }[] = [];
  private interestMap = new Map<number, IInterest>();

  // Estado editable vs original
  editedUser: any = { interests: [] as number[] };
  originalUser: any = { interests: [] as number[] };

  // Variables con Form Controls de ReactiveFormsModule
  interestsCtrl = new FormControl<string[]>({ value: [], disabled: true }, { nonNullable: true });

  telephoneCtrl = new FormControl<string>(
    { value: '', disabled: true },
    {
      nonNullable: true,
      validators: [Validators.pattern(PHONE_ALLOWED_REGEX), Validators.maxLength(MAX_PHONE_LEN)],
    }
  );

  descriptionCtrl = new FormControl<string>(
    { value: '', disabled: true },
    {
      nonNullable: true,
      validators: [
        Validators.maxLength(MAX_DESCRIPTION_LEN),
        Validators.pattern(DESCRIPTION_ALLOWED_REGEX),
      ],
    }
  );

  // Inyeccion de servicios
  private readonly userService = inject(UsersService);
  private readonly countriesService = inject(CountriesService);
  private readonly interestsService = inject(InterestsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  // ====== Carga de sesión ======
  getSessionData() {
    this.sesionData = this.userService.getSession()!;
  }

       ////////////////////////////////////////////////////////
  //  **************            ON INIT         **************  //  
      ////////////////////////////////////////////////////////

  async ngOnInit(): Promise<void> {
    this.getSessionData();

    // Cargamos en paralelo: usuario, países, intereses y los intereses del usuario
    const [user, countries, allInterests, userInterest] = await Promise.all([
      this.userService.getUserById(this.sesionData.userId),
      this.countriesService.getCountries(),
      this.interestsService.getInterests(),
      this.userService.getInterests(this.sesionData.userId),
    ]);

    this.user = user;
    this.countries = countries;
    this.allInterests = allInterests ?? [];
    this.userInterest = userInterest ?? [];

    console.log(this.allInterests);
    // Construye el mapa para búsquedas rápidas
    this.interestMap = buildInterestMap(this.allInterests);
    console.log(this.interestMap);

    // Inicializa modelos a partir de user + userInterest
    const interestsFromUser =
      Array.isArray(this.user?.interests) && this.user.interests.length
        ? this.user.interests.map((i: any) => (typeof i === 'object' ? Number(i.id) : Number(i)))
        : (this.userInterest ?? []).map((i) => Number(i.id));

    this.originalUser = {
      id: this.user.id,
      email: this.user.email ?? '',
      description: this.user.description ?? '',
      countries_id: this.user.countries_id ?? null,
      birthdate: toDateInputFormat(this.user.birthdate) ?? null,
      telephone: this.user.telephone ?? '',
      interests: interestsFromUser,
      avatar: this.user.avatar ?? null,
    };

    this.editedUser = { ...this.originalUser };

    // País del usuario
    const country = this.countries.find((c) => c.id === this.editedUser.countries_id);
    this.userCountry = country?.name ?? 'La Tierra';

    // Inicializa chips (string[]), Strings como recomendacion de MatChipsModule para la gestion de ids
    setControlValueSilently(this.interestsCtrl, numberIdsToStrings(interestsFromUser));

    // Habilita/deshabilita según edición
    this.applyEditableState(this.isEditing);

    // Truncado descripción
    this.updateDescriptionView();

    this.dataReady = true;
  }

            ////////////////////////////////////////////////////////
  //  **************            ESTADO DE EDICIÓN         **************  //  
            ////////////////////////////////////////////////////////

  private applyEditableState(editable: boolean) {

    // Silenciamos eventos automáticos de librería AbstractControl 
    const toggle = editable ? enableSilently : disableSilently;
    toggle(this.interestsCtrl);
    toggle(this.telephoneCtrl);
    toggle(this.descriptionCtrl);

    // Sincroniza valores con los controles (originalUser - editedUser)
    if (editable) {
      setControlValueSilently(
        this.interestsCtrl,
        numberIdsToStrings(this.editedUser?.interests ?? [])
      );
      setControlValueSilently(this.telephoneCtrl, this.editedUser?.telephone ?? '');
      setControlValueSilently(this.descriptionCtrl, this.editedUser?.description ?? '');
    } else {
      setControlValueSilently(
        this.interestsCtrl,
        numberIdsToStrings(this.originalUser?.interests ?? [])
      );
      setControlValueSilently(this.telephoneCtrl, this.originalUser?.telephone ?? '');
      setControlValueSilently(this.descriptionCtrl, this.originalUser?.description ?? '');
    }

    this.showSaveButton = false;
    this.updateDescriptionView();
  }

  /*toggleEdit() {
    this.isEditing = !this.isEditing;
    this.applyEditableState(this.isEditing);
  }*/

  // Activamos modo edición
  enterEdit(): void {
    if (this.isEditing) return;
    this.isEditing = true;
    this.applyEditableState(true);
    this.showAllInterests = false;
    this.editedUser.birthdate = toDateInputFormat(this.editedUser.birthdate);
    this.updateDescriptionView();
  }

  // Cancelamos modo edición
  cancelEdit(): void {
    if (!this.isEditing) return;
    this.editedUser = { ...this.originalUser };
    this.isEditing = false;
    this.applyEditableState(false);
    this.showAllInterests = false;
    this.showSaveButton = false;
    this.snackBar.open('Edición cancelada', 'Cerrar', {
      duration: 2000,
      panelClass: ['info-snackbar'],
    });
  }

    // Confirmacion cierre modo edición sin grabar
  onCloseClick(): void {
    if (this.isEditing) {
      const confirmClose = window.confirm('Hay cambios sin guardar. ¿Quieres cerrar igualmente?');
      if (!confirmClose) return;
      this.cancelEdit();
    }
    this.fullDescriptionVisible = false;
    this.updateDescriptionView();
    // Emite el cierre
    this.close.emit();
  }

            ////////////////////////////////////////////////////////
  //  **************            CONTROLES AVATAR         **************  //  
            ////////////////////////////////////////////////////////

  onAvatarClick(input: HTMLInputElement) {
    if (!this.isEditing) return; // evita subir avatar fuera de edición
    input.click();
  }

  async onAvatarSelected(event: Event) {
    if (!this.isEditing) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // función reset del input 
    const resetInput = () => {
      if (input) input.value = '';
    };

    if (!file) {
      resetInput();
      return;
    }

    // 1) Validación de tipo/extensión
    if (!isAllowedImage(file, ALLOWED_MIME, ALLOWED_EXT)) {
      this.snackBar.open('Formato no permitido. Solo PNG o JPG/JPEG.', 'Cerrar', {
        duration: 3500,
        panelClass: ['error-snackbar'],
      });
      resetInput();
      return;
    }

    // 2) Límite de tamaño
    if (file.size > MAX_AVATAR_BYTES) {
      const mb = (MAX_AVATAR_BYTES / (1024 * 1024)).toFixed(0);
      this.snackBar.open(`El archivo es demasiado grande. Máximo ${mb} MB.`, 'Cerrar', {
        duration: 3500,
        panelClass: ['error-snackbar'],
      });
      resetInput();
      return;
    }

    // 3) Verificación de decodificación y dimensiones mínimas
    try {
      const { width, height } = await getImageSize(file);
      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        this.snackBar.open(
          `La imagen es muy pequeña (${width}×${height}). Mínimo ${MIN_WIDTH}×${MIN_HEIGHT}.`,
          'Cerrar',
          { duration: 4000, panelClass: ['error-snackbar'] }
        );
        resetInput();
        return;
      }
    } catch {
      this.snackBar.open('El archivo no parece una imagen válida.', 'Cerrar', {
        duration: 3500,
        panelClass: ['error-snackbar'],
      });
      resetInput();
      return;
    }

    // 4) Previsualización inmediata
    const previewUrl = URL.createObjectURL(file);
    this.editedUser.avatar = previewUrl;
    this.showSaveButton = true;

    try {
      // 5) Subir al servidor
      const uploadedUrl = await this.userService.uploadUserAvatar(this.sesionData.userId, file);
      this.editedUser.avatar = uploadedUrl; // url definitiva
    } catch {
      this.snackBar.open('No se pudo subir el avatar. Intenta de nuevo.', 'Cerrar', {
        duration: 3500,
        panelClass: ['error-snackbar'],
      });
    } finally {
      URL.revokeObjectURL(previewUrl);
      resetInput();
    }
  }

      ////////////////////////////////////////////////////////
  //  **************            ONSAVE         **************  //  
      ////////////////////////////////////////////////////////

  //Errores en controllers del formulario    
  private hasFormErrors(): boolean {
    return this.telephoneCtrl.invalid || this.interestsCtrl.invalid || this.descriptionCtrl.invalid;
  }

  async onSave() {
    try {
      // 1) Validación local
      if (this.hasFormErrors()) {
        this.snackBar.open('Hay errores en el formulario. Corrige y vuelve a guardar.', 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
        this.isEditing = true;
        this.showSaveButton = true;
        return;
      }

      // 2) Preparar payload
      const interestsIds: number[] = stringsIdsToNumbers(this.interestsCtrl.value ?? []);
      const safeDescription = sanitizeDescUtil(
        this.descriptionCtrl.value ?? '',
        MAX_DESCRIPTION_LEN
      );

      const payload = {
        ...this.editedUser,
        avatar: normalizeAvatarPath(this.editedUser.avatar ?? ''),
        telephone: this.telephoneCtrl.value ?? '',
        description: safeDescription,
        interests: interestsIds,
      };

      // 3) Envío
      await this.userService.updateUserById(payload);

      // 4) Si todo ok: salir de edición
      this.isEditing = false;
      this.applyEditableState(false);
      this.showSaveButton = false;

      // Recarga desde el server para sincronizar original
      const fresh = await this.userService.getUserById(this.sesionData.userId);
      this.user = fresh;

      this.originalUser = {
        id: this.user.id,
        email: this.user.email ?? '',
        description: this.user.description ?? '',
        countries_id: this.user.countries_id ?? null,
        birthdate: toDateInputFormat(this.user.birthdate) ?? null,
        telephone: this.user.telephone ?? '',
        interests: interestsIds,
        avatar: this.user.avatar ?? null,
      };
      this.editedUser = { ...this.originalUser };

      this.showSuccessToast();
      this.close.emit();
    } catch (error) {
      // Mantener modo edición y valores del usuario (incluidos errores)
      this.snackBar.open('No se pudo guardar. Revisa la conexión o vuelve a intentar.', 'Cerrar', {
        duration: 4000,
        panelClass: ['error-snackbar'],
      });
      this.isEditing = true;
      this.applyEditableState(true);
      this.showSaveButton = true;
    }
  }

        ////////////////////////////////////////////////////////
  //  **************            ONLOGOUT         **************  //  
      ////////////////////////////////////////////////////////
  onLogout() {
    this.userService.logout();
    this.router.navigate(['/home']);
  }


        ////////////////////////////////////////////////////////
  //  **************            UTILS         **************  //  
      ////////////////////////////////////////////////////////

  // ====== Intereses seleccionados (como objetos) ======
  get selectedInterests(): IInterest[] {
    const ids = stringsIdsToNumbers(this.interestsCtrl.value ?? []);
    return pickInterestsByIds(ids, this.interestMap);
  }

  // ====== Descripción (truncate/expand) ======
  updateDescriptionView() {
    const desc = this.editedUser.description || '';
    const { text, truncated } = truncate(desc, 30, this.fullDescriptionVisible);
    this.truncatedDescription = text;
    this.showExpandLink = truncated;
  }

  toggleDescription() {
    this.fullDescriptionVisible = !this.fullDescriptionVisible;
    this.updateDescriptionView();
  }

  // ====== Notificaciones ======
  private showSuccessToast() {
    this.snackBar.open(`¡Perfil editado! 🙂`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }

  // ====== Eventos Input ======
  // añadimos sanitización 

  //Telephone
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value ?? '';
    const sanitized = val.replace(/[^0-9A-Za-z\-\.\(\)\+\s]/g, ''); // quita lo no permitido

    if (sanitized !== val) {
      setControlValueSilently(this.telephoneCtrl, sanitized);
    }
    this.editedUser.telephone = sanitized;
    this.showSaveButton = true;
  }

  //Description
  onDescriptionInput(event: Event) {
    const el = event.target as HTMLTextAreaElement;
    const val = el.value ?? '';
    const sanitized = sanitizeDescUtil(val, MAX_DESCRIPTION_LEN);

    setControlValueSilently(this.descriptionCtrl, sanitized);

    // Mantiene editableUser sincronizado para payload
    this.editedUser.description = sanitized;
    this.showSaveButton = true;
  }
}
