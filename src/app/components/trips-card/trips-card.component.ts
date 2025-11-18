import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ITripResponse } from '../../interfaces/itrip.interface';

type TripListMode = 'available' | 'mine';

@Component({
  selector: 'app-trips-card',
  imports: [DatePipe],
  templateUrl: './trips-card.component.html',
  styleUrl: './trips-card.component.css',
})
export class TripCardComponent {
    @Input() trip!: ITripResponse;
    @Input() mode: TripListMode = 'available';
    @Output() joinClicked = new EventEmitter<void>()

    joinPopUp(){
        //TODO: hacer que aparezca el pop up del componente de join
        this.joinClicked.emit();
    }

    viewDetails(){
        //TODO: hacer que aparezca la pantalla de ver detalles
    }

    editTrip(){
        //TODO: hacer que aparezca la pantalla de editar viaje
    }

    deleteTrip(){
        //TODO: hacer que aparezca el pop up del elimar trip msg
    }
    showRequests(){
        //TODO: ir a la ruta de de rquessts
    }
}
