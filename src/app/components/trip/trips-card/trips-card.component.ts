import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { TripListMode, TripFormMode } from '../../../types/trip-types';
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
    @Output() detailClicked =  new EventEmitter<void>();
    @Output() requestClicked = new EventEmitter<ITripResponse>();
    @Output() editClicked = new EventEmitter<void>();
    
    joinPopUp(){
        this.joinClicked.emit();
    }

    viewDetails(){
        this.detailClicked.emit();
    }

    editTrip(){
        this.editClicked.emit();
    }

    deleteTrip(){
        this.deleteClicked.emit();
    }

    //TODO: MIRAR COMO HAN HECHO ESTO PARA JUNTARLO
    showRequests(){
        this.requestClicked.emit(this.trip);
    }
}
