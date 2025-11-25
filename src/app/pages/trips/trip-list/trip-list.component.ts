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

@Component({
  selector: 'app-trip-list',
  imports: [TripsHeaderComponent, TripCardComponent, JoinTripComponent, FormsModule, DeleteTripComponent, DetailTripComponent, TripFormComponent],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.css',
})
export class TripListComponent {
  userService = inject(UsersService);
  tripsService = inject(TripsService);

  
    //TODO: QUITAR PLACEHOLDERS
  trips: ITripResponse[] = [ {
    id: 1,
    name: "Ruta Andina por Bolivia",
    description: "Explora la cultura boliviana visitando La Paz, Uyuni y Sucre. Disfruta de la gastronomía local y paisajes únicos.",
    destinyCountryId: 1,
    destinyPlace: "La Paz, Uyuni, Sucre",
    destinyImage: "https://picsum.photos/seed/bolivia/800/600",
    itinerary: "Día 1: La Paz - Día 2: Salar de Uyuni - Día 3: Sucre - Día 4: Retorno a La Paz.",
    meansOfTransportsId: 2,
    startDate: "2025-12-10T08:00:00.000Z",
    endDate: "2025-12-15T18:00:00.000Z",
    creatorId: 7,
    accommodationsId: 5,
    costPerPerson: 750,
    minParticipants: 5,
    status: 'open',
    createdAt: "2025-11-21T09:00:00.000Z",
    updatedAt: "2025-11-21T09:00:00.000Z"
  },
  {
    id: 2,
    name: "Aventura en Patagonia",
    description: "Realiza trekking en el Parque Nacional Torres del Paine. Incluye guía, alojamientos y actividades de montaña.",
    destinyCountryId: 2,
    destinyPlace: "Torres del Paine",
    destinyImage: "https://picsum.photos/seed/patagonia/800/600",
    itinerary: "Día 1: Llegada y alojamiento - Día 2: Trekking Base Torres - Día 3: Excursión Lago Grey.",
    meansOfTransportsId: 3,
    startDate: "2026-01-05T07:30:00.000Z",
    endDate: "2026-01-10T19:00:00.000Z",
    creatorId: 3,
    accommodationsId: 12,
    costPerPerson: 1200,
    minParticipants: 8,
    status: 'open',
    createdAt: "2025-11-21T10:00:00.000Z",
    updatedAt: "2025-11-21T10:00:00.000Z"
  },
  {
    id: 3,
    name: "Descubre Machu Picchu",
    description: "Tour guiado por Cuzco, Aguas Calientes y Machu Picchu. Cultura, historia y aventura.",
    destinyCountryId: 3,
    destinyPlace: "Machu Picchu",
    destinyImage: "https://picsum.photos/seed/machu/800/600",
    itinerary: "Día 1: Llegada a Cuzco - Día 2: Tren hasta Aguas Calientes - Día 3: Visita a Machu Picchu.",
    meansOfTransportsId: 1,
    startDate: "2026-03-12T10:00:00.000Z",
    endDate: "2026-03-15T17:00:00.000Z",
    creatorId: 9,
    accommodationsId: 18,
    costPerPerson: 900,
    minParticipants: 6,
    status: 'open',
    createdAt: "2025-11-21T11:00:00.000Z",
    updatedAt: "2025-11-21T11:20:00.000Z"
  }];

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
    this.searchTrips();
  }

  getSessionData() {
    this.sesionData = this.userService.getSession();
  }

  changeMode(newMode: TripListMode) {
    if (this.mode === newMode) return;
    this.mode = newMode;

    this.searchTrips();
  }

  createTripSidebar() {
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
        this.trips = tripsRes.filter((trip) => trip.creatorId === this.sesionData?.userId);
      } else {
        this.trips = tripsRes;
      }
    } catch (error) {
      console.error('Error al cargar los viajes', error);
    }
  }
}
