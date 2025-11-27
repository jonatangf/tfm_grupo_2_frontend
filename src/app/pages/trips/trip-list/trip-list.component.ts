import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TripsHeaderComponent } from '../../../components/trip/trips-header/trips-header.component';
import { ITrip, ITripFilters, ITripResponse } from '../../../interfaces/itrip.interface';
import { TripsService } from '../../../services/trips.service';
import { UsersService } from '../../../services/users.service';
import { ISession } from '../../../interfaces/users/isession';
import { TripCardComponent } from '../../../components/trip/trips-card/trips-card.component';
import { JoinTripComponent } from '../../../components/trip/join-trip/join-trip.component';
import { DeleteTripComponent } from "../../../components/trip/delete-trip/delete-trip.component";
import { DetailTripComponent } from '../../../components/trip/detail-trip/detail-trip.component';
import { TripListMode, PopUpType, TripFormMode } from '../../../types/trip-types';
import { TripFormComponent } from '../../../components/trip/trip-form/trip-form.component';
import { PetitionsComponent } from "../../petitions/petitions.component";
import { setAlternateWeakRefImpl } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-trip-list',
  imports: [TripsHeaderComponent, TripCardComponent, JoinTripComponent, FormsModule, DeleteTripComponent, DetailTripComponent, TripFormComponent, PetitionsComponent],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css',
})
export class TripListComponent {
  userService = inject(UsersService);
  tripsService = inject(TripsService);
  
  trips: ITripResponse[] = [];

  sesionData: ISession | null = {
    userId: -1,
    username: '',
    email: '',
    photo: '',
  };

  filters: ITripFilters = {
    destinyPlace: '',
    startDate: '',
    endDate: '',
    maxCost: null,
  };

  mode: TripListMode = 'available';
  tripFormMode: TripFormMode | null = null;
  selectedTrip: ITripResponse | null = null;
  popUpType: PopUpType | null = null;
  
  //Funciones para gestionar los pop ups
  onOpenPopUp(trip: ITripResponse, type: PopUpType, formMode: TripFormMode | null){
    if(formMode) this.tripFormMode = formMode;
    
    this.selectedTrip = trip;
    this.popUpType = type;
  }
  onClosePopUp(){
    if(this.popUpType === 'delete' || this.popUpType === 'form')
        this.searchTrips();

    this.selectedTrip = null;
    this.popUpType = null;
    this.tripFormMode = null;
  }

  ngOnInit() {
    this.getSessionData();
    if (this.sesionData?.userId && this.sesionData.userId !== -1) {
        this.searchTrips();
    } 
  }

  getSessionData() {
    this.sesionData = this.userService.getSession();
  }

  changeMode(newMode: TripListMode) {
    if (this.mode === newMode) return;

    this.mode = newMode;
    this.searchTrips();
  }

  createTripPopUp() {
    this.popUpType ='form';
    this.tripFormMode = 'create';
  }

  openUserSidebar() {
    this.popUpType = 'user';
  }

  onMaxCostChange(value: number) {
    if (value < 0) {
      this.filters.maxCost = 0;
    }
  }

  clearFilters() {
    this.filters = {
      destinyPlace: '',
      startDate: '',
      endDate: '',
      maxCost: null,
    };

    this.searchTrips();
  }

  async searchTrips() {
    try {
        const tripsRes = await this.tripsService.getAllTrips(this.filters);
        if (this.mode === 'mine') {
            this.trips = tripsRes.filter(trip => trip.creatorId === this.sesionData?.userId);

        } else {
            this.trips = tripsRes.filter(trip => trip.creatorId !== this.sesionData?.userId);
        }
    } catch (error) {
        console.error('Error al cargar los viajes', error);
    }
  }
}
