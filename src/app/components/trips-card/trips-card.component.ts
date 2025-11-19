import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITripResponse } from '../../interfaces/itrip.interface';
import { TripListMode, PopUpType } from '../../types/trip-types';
@Component({
  selector: 'app-trips-card',
  imports: [DatePipe],
  templateUrl: './trips-card.component.html',
  styleUrl: './trips-card.component.css',
})
export class TripCardComponent {
    @Input() trip!: ITripResponse;
    @Input() mode: TripListMode = 'available';

    @Output() joinClicked = new EventEmitter<void>();
    @Output() deleteClicked = new EventEmitter<void>();


    joinPopUp(){
        this.joinClicked.emit();
    }

    viewDetails(){
        //TODO: hacer que aparezca la pantalla de ver detalles
    }

    editTrip(){
        //TODO: hacer que aparezca la pantalla de editar viaje
    }

    deleteTrip(){
        this.deleteClicked.emit();
    }
    showRequests(){
        //TODO: ir a la ruta de de requests
    }
}
