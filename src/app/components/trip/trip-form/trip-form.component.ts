import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { TripFormMode } from '../../../types/trip-types';

@Component({
  selector: 'app-trip-form',
  imports: [],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.css',
})
export class TripFormComponent {
    @Input() trip!: ITripResponse | null;
    @Input() formMode: TripFormMode = 'create';
    @Output() close = new EventEmitter<void>();

    closePopUp(){
        this.close.emit();
    }

    ngOnInit(){
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
    }

}
