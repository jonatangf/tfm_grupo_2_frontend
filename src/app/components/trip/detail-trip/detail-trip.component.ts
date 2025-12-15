import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { MembersListComponent } from '../../../components/trip/members-list/members-list.component';
import { CommonModule } from '@angular/common';
import { TripListMode } from '../../../types/trip-types';
import { DateRangePipe } from '../../../utils/date-format.pipe';
import { ITransport } from '../../../interfaces/itransport.interface';
import { IAccomodation } from '../../../interfaces/iaccomodation.interface';
import { ICountry } from '../../../interfaces/icountry.interface';
import { TransportsService } from '../../../services/transports.service';
import { CountriesService } from '../../../services/countries.service';
import { AccomodationsService } from '../../../services/accomodations.service';

@Component({
  selector: 'app-detail-trip',
  imports: [DateRangePipe, MembersListComponent, CommonModule],
  templateUrl: './detail-trip.component.html',
  styleUrl: './detail-trip.component.css',
})
export class DetailTripComponent {
    @Input() trip!: ITripResponse;
    @Input() tripMode!: TripListMode;
    
    @Output() editFormClicked = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    showMembersList = false;

    transportsService = inject(TransportsService);
    countriesService = inject(CountriesService);
    accomodationsService = inject(AccomodationsService);

    transports : ITransport[] = [];
    countries: ICountry[] = [];
    accomodations: IAccomodation[] = [];

    ngOnInit(){
        this.loadTransports();
        this.loadCountries();
        this.loadAccomodations();
    }

    closePopUp(){
        this.close.emit();
    }

    editTrip(){
        this.editFormClicked.emit();
    }

    toggleMembersList(){
        this.showMembersList = !this.showMembersList;
    }

    closeMembersList(){
        this.showMembersList = false;
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

    getCountryName(id: number | null): string {
        if (!id) return '';
        return this.countries.find(c => c.id === id)?.name ?? '';
    }

    getTransportName(id: number | null): string {
        if (!id) return '';
        return this.transports.find(t => t.id === id)?.name ?? '';
    }

    getAccomodationName(id: number | null): string {
        if (!id) return 'Ninguno';
        return this.accomodations.find(a => a.id === id)?.name ?? 'Ninguno';
    }


    getStatusMessage(): string {
        switch(this.trip?.status){
            case 'cancelled':
                return 'VIAJE CANCELADO';

            case 'finished':
                return 'VIAJE FINALIZADO';

            case 'closed':
                return 'INSCRIPCIÓN CERRADA';

            default:
                return '';
        }
    }
}
