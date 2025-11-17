import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripsHeaderComponent } from '../../../components/shared/trips-header/trips-header.component';
import { ITripFilters, ITripResponse } from '../../../interfaces/itrip.interface';
import { TripsService } from '../../../services/trips.service';

type TripListMode = 'available' | 'mine';

@Component({
  selector: 'app-trip-list',
  imports: [TripsHeaderComponent, FormsModule],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css',
})


export class TripListComponent {
    tripsService = inject(TripsService);
    trips: ITripResponse[] = [];
    
    // TODO: CAMBIAR POR EL VERDADERO CURRENT ID 
    currentUserId = 1; 

    mode: TripListMode = 'available';

    filters: ITripFilters = {
        destinyPlace: '',
        startDate: '',
        endDate: '',
        maxCost: null
    };

    ngOnInit() {
        this.searchTrips();
    }

    changeMode(newMode: TripListMode) {
        if(this.mode === newMode) return;
        this.mode = newMode;

        this.searchTrips();
    }

    createTripSidebar() {
        // TODO:QUE APREZCA A CREAR VIAJE SIDEBAR
    }

    onMaxCostChange(value: number){
        if(value < 0 ){
            this.filters.maxCost = 0;
        }
    }

    clearFilters(){
        this.filters = {
            destinyPlace: '',
            startDate: '',
            endDate: '',
            maxCost: null
        }

        this.searchTrips();
    }

    async searchTrips(){
        try{
            const tripsRes = await this.tripsService.getAllTrips(this.filters);

            if(this.mode === 'mine'){
                this.trips = tripsRes.filter(trip => trip.creatorId === this.currentUserId);
            } else {
                this.trips = tripsRes;
            }
        } catch(error){
            console.error('Error al cargar los viajes', error)
        }
    }
}
