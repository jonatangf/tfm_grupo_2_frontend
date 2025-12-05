import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'app-delete-trip',
  imports: [],
  templateUrl: './delete-trip.component.html',
  styleUrl: './delete-trip.component.css',
})
export class DeleteTripComponent {
    tripService = inject(TripsService);

    @Input() trip!: ITripResponse;
    @Output() close = new EventEmitter<void>();

    closePopUp() {
        this.close.emit();
    }

    rejectDelete() {
        this.closePopUp();
    }

  async acceptDelete() {
    try {
        const response = await this.tripService.removeTrip(this.trip.id);
        this.closePopUp();
    } catch (error) {
        console.error('Error al solicitar eliminar el viaje', error);
    }
  }
}
