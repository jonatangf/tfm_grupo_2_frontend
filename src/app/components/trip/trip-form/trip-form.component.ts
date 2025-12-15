import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ITripResponse, ITrip } from '../../../interfaces/itrip.interface';
import { TripFormMode } from '../../../types/trip-types';
import { TripsService } from '../../../services/trips.service';
import { ITransport } from '../../../interfaces/itransport.interface';
import { TransportsService } from '../../../services/transports.service';
import { CountriesService } from '../../../services/countries.service';
import { ICountry } from '../../../interfaces/icountry.interface';
import { UsersService } from '../../../services/users.service';
import { ISession } from '../../../interfaces/users/isession';
import { AccomodationsService } from '../../../services/accomodations.service';
import { IAccomodation } from '../../../interfaces/iaccomodation.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trip-form',
  imports: [ReactiveFormsModule],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.css',
})
export class TripFormComponent {
    @Input() trip!: ITripResponse | null;
    @Input() formMode: TripFormMode = 'create';
    @Output() close = new EventEmitter<void>();

    userService = inject(UsersService);
    tripService= inject(TripsService);
    transportsService = inject(TransportsService);
    countriesService = inject(CountriesService);
    accomodationsService = inject(AccomodationsService);

    tripForm: FormGroup;

    transports : ITransport[] = [];
    countries: ICountry[] = [];
    accomodations: IAccomodation[] = [];
    sesionData: ISession | null = {
      userId: -1,
      username: '',
      email: '',
      photo: '',
    }

    //Coge solo la fecha del dia de hoy
    today = new Date().toISOString().split('T')[0];
    
    private snackBar = inject(MatSnackBar);

    //Load data for forms
    async getSessionData() {
        this.sesionData = await this.userService.getSession();
    }

    async loadTransports(){
        this.transports = await this.transportsService.getTransports();
    }

    async loadCountries(){
        this.countries = await this.countriesService.getCountries();
    }

    async loadAccomodations(){
        this.accomodations = await this.accomodationsService.getAccomodations();
    }

    closePopUp(){
        this.close.emit();
    }

    constructor(){
        this.tripForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255), Validators.pattern(/^(?!\s*$).+/)]),
            description: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
            startDate: new FormControl('', [Validators.required, this.dateRangeValidator]),
            endDate: new FormControl('', [Validators.required, this.dateRangeValidator]),
            cost: new FormControl('', [Validators.required, Validators.min(0)]),
            minParticipants: new FormControl('', [Validators.required, Validators.min(1)]),
            country: new FormControl('', [Validators.required]),
            destiny: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(150), Validators.pattern(/^(?!\s*$).+/)]),
            destinyImg: new FormControl('', [Validators.required, Validators.maxLength(500), this.webImgValidator]),
            transport: new FormControl('', [Validators.required]),
            accomodation: new FormControl(''),
            itinerary: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
        }, []);
    }

    ngOnInit(){
        this.loadTransports();
        this.loadCountries();
        this.getSessionData();
        this.loadAccomodations();

        if(this.formMode ==='edit' && this.trip){
            this.fillFormDetails();
            if(!this.canEdit())
                this.tripForm.disable();
        }
    }

    fillFormDetails(){
        this.tripForm.patchValue({
            title: this.trip?.name,
            description: this.trip?.description,
            startDate: this.toInputDate(this.trip?.startDate),
            endDate: this.toInputDate(this.trip?.endDate),
            cost: this.trip?.costPerPerson,
            minParticipants: this.trip?.minParticipants,
            country: this.trip?.destinyCountryId,
            destiny: this.trip?.destinyPlace,
            destinyImg: this.trip?.destinyImage,
            transport: this.trip?.meansOfTransportsId,
            accomodation: this.trip?.accommodationsId,
            itinerary: this.trip?.itinerary,
        });
    }
  
    async submitForm(){
        if(this.tripForm.invalid) return;
        const tripData: ITrip = {
            name: this.tripForm.value.title,
            description: this.tripForm.value.description,
            destinyCountryId: this.tripForm.value.country,
            destinyPlace: this.tripForm.value.destiny,
            destinyImage: this.tripForm.value.destinyImg,
            itinerary: this.tripForm.value.itinerary,
            meansOfTransportsId: this.tripForm.value.transport,
            accommodationsId: this.tripForm.value.accomodation || null,
            startDate: this.tripForm.value.startDate,
            endDate: this.tripForm.value.endDate,
            costPerPerson: this.tripForm.value.cost,
            minParticipants: this.tripForm.value.minParticipants,
                    
            creatorId: this.sesionData?.userId || -1,
            status: this.formMode === 'create' ? 'open' : this.trip?.status || 'open'
        };

        try {
            if(this.formMode === 'create') {
                const response =  await this.tripService.createTrip(tripData);
                this.showEditCreateToast('creado');
                
            }
            else if(this.formMode === 'edit' && this.trip?.id != null){
                const response = await this.tripService.updateTrip(this.trip.id, tripData);
                this.showEditCreateToast('editado');
            }

            this.closePopUp();
            
        } catch (error) {
            console.error('Error al solicitar crear el viaje', error);
        }
    }


    //Function to check errors in the controls
    checkControl(controlName: string, errorName: string): boolean | undefined {
        return (this.tripForm.get(controlName)?.hasError(errorName) && this.tripForm.get(controlName)?.touched);
    }   
    
    //Funcion que checkea que la url de la imagen sea valida
    webImgValidator(controlName: AbstractControl): any{
        const url = controlName.value;
        if(!url) return null
        
        //Web page image pattern (does not check the extension)
        const pattern = /^https?:\/\/.+/i
        return pattern.test(url) ? null : {'webImgValidator' : 'La URL debe ser una imagen alojada en internet'}
    }

    //Conversion from ISO to String
    toInputDate(date: string | null | undefined): string {
        if (!date) return '';
        return new Date(date).toISOString().slice(0, 10);
    }

    //Validacion para que no te dejen elegir fechas mas pequeñas que la actual y start < end
    dateRangeValidator(control: AbstractControl): ValidationErrors | null {
        const form = control.parent;
        if(!form) return null;

        const start = form.get('startDate')?.value;
        const end = form.get('endDate')?.value;

        if(!start || !end) return null;
        
        return (new Date(end) < new Date(start)) ? {dateRange:true} : null;
    }

    
    canEdit(): boolean{
        return this.trip?.status === 'open' || this.trip?.status === 'closed';
    }

    getStatusMessage(): string {
        switch(this.trip?.status){
            case 'cancelled':
                return 'Este viaje esta cancelado y no se puede editar';

            case 'finished':
                return 'Este viaje esta finalizado y no se puede editar';

            default:
                return '';
        }
    }

    private showEditCreateToast(mode: string) {
      this.snackBar.open(`¡Viaje ${mode} correctamente!`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
    }
}
