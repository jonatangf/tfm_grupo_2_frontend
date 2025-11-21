import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ITripResponse, ITrip } from '../../../interfaces/itrip.interface';
import { TripFormMode } from '../../../types/trip-types';
import { TripsService } from '../../../services/trips.service';
import { ITransport } from '../../../interfaces/itransport.interface';
import { TransportsService } from '../../../services/transports.service';
import { CountriesService } from '../../../services/countries.service';
import { ICountry } from '../../../interfaces/icountry.interface';
import { UsersService } from '../../../services/users.service';
import { ISession } from '../../../interfaces/users/isession';
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

    tripService= inject(TripsService);
    transportsService = inject(TransportsService);
    countriesService = inject(CountriesService);

    tripForm: FormGroup;

    //TODO: QUITAR PLACEHOLDERS
    transports : ITransport[] = [
        { id: 1, name: 'Avión' },
        { id: 2, name: 'Tren' },
        { id: 3, name: 'Autobús' },
        { id: 4, name: 'Barco' },
        { id: 5, name: 'Coche' },
    ];

    countries: ICountry[] =[
    { id: 1, name: 'España' },
    { id: 2, name: 'Francia' },
    { id: 3, name: 'Italia' },
    { id: 4, name: 'Alemania' },
    { id: 5, name: 'Portugal' }];


    userService = inject(UsersService);
    sesionData: ISession | null = {
      userId: -1,
      username: '',
      email: '',
      photo: '',
    }
    async getSessionData() {
        this.sesionData = await this.userService.getSession();
    }

    closePopUp(){
        this.close.emit();
    }

    constructor(){
        this.tripForm = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
            description: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            cost: new FormControl('', [Validators.required, Validators.min(0)]),
            minParticipants: new FormControl('', [Validators.required, Validators.min(1)]),
            country: new FormControl('', [Validators.required]),
            destiny: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
            destinyImg: new FormControl('', [Validators.required, this.webImgValidator]),
            transport: new FormControl('', [Validators.required]),
            itinerary: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).+/)]),
        }, []);
    }

    ngOnInit(){
        this.loadTransports();
        this.loadCountries();
        this.getSessionData();
        if(this.formMode ==='edit' && this.trip)
            this.fillFormDetails();
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
            itinerary: this.trip?.itinerary,
        });
    }
  
    async submitForm(){
        if(this.tripForm.invalid) return;

        const tripData: ITrip = {
            name: this.tripForm.value.title,
            description: this.tripForm.value.description,
            destinyCountryId: Number(this.tripForm.value.country),
            destinyPlace: this.tripForm.value.destiny,
            destinyImage: this.tripForm.value.destinyImg,
            itinerary: this.tripForm.value.itinerary,
            meansOfTransportsId: Number(this.tripForm.value.transport),
            startDate: this.tripForm.value.startDate,
            endDate: this.tripForm.value.endDate,
            costPerPerson: this.tripForm.value.cost,
            minParticipants: this.tripForm.value.minParticipants,
                    
            creatorId: this.sesionData?.userId || -1,
            accommodationsId: 1,
            status: this.formMode === 'create' ? 'open' : this.trip?.status || 'open'
        };

        try {
            if(this.formMode === 'create') {
               const response =  await this.tripService.createTrip(tripData);
               if(response.success){
                    console.log('Solicitud de crear trip enviada, id', response.tripId);
                    this.closePopUp();
               }else{
                console.warn('La API a devuelto succes = false');
               }
            }

            else if(this.formMode === 'edit' && this.trip?.id != null){
                const response = await this.tripService.updateTrip(this.trip.id, tripData);
                if(response.success){
                    console.log('Solicitud de crear trip enviada');
                    this.closePopUp();
               }else{
                console.warn('La API a devuelto succes = false');
               }
            }
            
        } catch (error) {
            console.error('Error al solicitar crear el viaje', error);
        }
    }

    async loadTransports(){
        try {
            this.transports = await this.transportsService.getTransports();
        } catch (error) {
            console.error('Error cargando transportes', error);
        }
    }

    async loadCountries(){
        try {
            this.countries = await this.countriesService.getCountries();
        } catch (error) {
            console.error('Error cargando paises', error);
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

    toInputDate(date: string | null | undefined): string {
        if (!date) return '';
        return new Date(date).toISOString().slice(0, 10);
    }
}
