import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-detail-trip',
  imports: [DatePipe],
  templateUrl: './detail-trip.component.html',
  styleUrl: './detail-trip.component.css',
})
export class DetailTripComponent {
    @Input() trip!: ITripResponse;
    
    @Output() editFormClicked = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    closePopUp(){
        this.close.emit();
    }

    editTrip(){
        this.editFormClicked.emit();
    }

    showTripMembers(){
        //TODO: DESPLEGAR POP UP DE SHOW TRIP MEMBERS
    }
}
