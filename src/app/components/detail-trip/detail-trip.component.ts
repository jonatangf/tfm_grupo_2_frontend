import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITripResponse } from '../../interfaces/itrip.interface';
@Component({
  selector: 'app-detail-trip',
  imports: [],
  templateUrl: './detail-trip.component.html',
  styleUrl: './detail-trip.component.css',
})
export class DetailTripComponent {
    @Input() trip!: ITripResponse;
    @Output() close = new EventEmitter<void>();

    closePopUp(){
        this.close.emit();
    }

    editTrip(){

    }
}
