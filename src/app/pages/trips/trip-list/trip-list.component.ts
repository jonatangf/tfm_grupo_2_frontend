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
  trips: ITripResponse[] = [
  {
    id: 1,
    name: 'Santiago de Compostela',
    description: 'Camino corto de 5 días con paradas gastronómicas.',
    destinyPlace: 'Santiago de Compostela',
    destinyImage: '',
    itinerary: 'Día 1: Llegada · Día 2-4: Etapas · Día 5: Visita casco histórico',
    meansOfTransportsId: 1,
    startDate: '2025-12-15',
    endDate: '2025-12-20',
    creatorId: 1,               // tu usuario
    accommodationsId: 1,
    costPerPerson: 56,
    minParticipants: 4,
    status: 'open',
    createdAt: '2025-11-10T10:00:00.000Z',
    updatedAt: '2025-11-10T10:00:00.000Z',
    participantsId: [1, 2, 3]
  },
  {
    id: 2,
    name: 'Barcelona',
    description: 'Escapada urbana con visita a la Sagrada Familia.',
    destinyPlace: 'Barcelona',
    destinyImage: '',
    itinerary: 'Día 1: Centro · Día 2: Gaudí · Día 3: Costa',
    meansOfTransportsId: 2,
    startDate: '2025-06-03',
    endDate: '2025-06-06',
    creatorId: 1,               // también tuyo (para modo "mine")
    accommodationsId: 2,
    costPerPerson: 97,
    minParticipants: 2,
    status: 'open',
    createdAt: '2025-11-11T12:00:00.000Z',
    updatedAt: '2025-11-11T12:00:00.000Z',
    participantsId: [1]
  },
  {
    id: 3,
    name: 'Madrid',
    description: 'Fin de semana cultural por museos y barrios históricos.',
    destinyPlace: 'Madrid',
    destinyImage: '',
    itinerary: 'Día 1: Centro · Día 2: Museos · Día 3: Parque',
    meansOfTransportsId: 1,
    startDate: '2025-12-19',
    endDate: '2025-12-21',
    creatorId: 1,
    accommodationsId: 3,
    costPerPerson: 49,
    minParticipants: 3,
    status: 'open',
    createdAt: '2025-11-12T09:30:00.000Z',
    updatedAt: '2025-11-12T09:30:00.000Z',
    participantsId: [1, 4]
  },
  {
    id: 4,
    name: 'Roma',
    description: 'Puente largo descubriendo la ciudad eterna.',
    destinyPlace: 'Roma',
    destinyImage: '',
    itinerary: 'Día 1: Coliseo · Día 2: Vaticano · Día 3: Trastévere',
    meansOfTransportsId: 3,
    startDate: '2025-12-18',
    endDate: '2025-12-21',
    creatorId: 2,               // de otro usuario -> "viaje disponible"
    accommodationsId: 4,
    costPerPerson: 300,
    minParticipants: 4,
    status: 'open',
    createdAt: '2025-11-13T14:00:00.000Z',
    updatedAt: '2025-11-13T14:00:00.000Z',
    participantsId: [2, 5, 6]
  },
  {
    id: 5,
    name: 'Mallorca',
    description: 'Playas y calas en la isla durante una semana.',
    destinyPlace: 'Mallorca',
    destinyImage: '',
    itinerary: 'Día 1: Palma · Día 2-6: Calas · Día 7: Despedida',
    meansOfTransportsId: 3,
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    creatorId: 3,
    accommodationsId: 5,
    costPerPerson: 57,
    minParticipants: 4,
    status: 'open',
    createdAt: '2025-11-14T11:15:00.000Z',
    updatedAt: '2025-11-14T11:15:00.000Z',
    participantsId: [3]
  },
  {
    id: 6,
    name: 'Sevilla',
    description: 'Semana Santa en Sevilla con procesiones y tapas.',
    destinyPlace: 'Sevilla',
    destinyImage: '',
    itinerary: 'Día 1: Centro · Día 2: Triana · Día 3: Barrio Santa Cruz',
    meansOfTransportsId: 1,
    startDate: '2025-04-07',
    endDate: '2025-04-10',
    creatorId: 4,
    accommodationsId: 6,
    costPerPerson: 149,
    minParticipants: 2,
    status: 'open',
    createdAt: '2025-11-15T16:45:00.000Z',
    updatedAt: '2025-11-15T16:45:00.000Z',
    participantsId: [4, 7]
  }
];

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
