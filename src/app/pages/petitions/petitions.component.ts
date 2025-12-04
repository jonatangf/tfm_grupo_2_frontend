import { Component, inject, Input , EventEmitter, Output} from '@angular/core';
import { ITripResponse } from '../../interfaces/itrip.interface';
import { ParticipationsService } from '../../services/participations.service';
import { ITripJoinRequestResponse } from '../../interfaces/iparticipation.interface';
import { DateRangePipe } from '../../utils/date-format.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-petitions',
  imports: [DateRangePipe],
  templateUrl: './petitions.component.html',
  styleUrl: './petitions.component.css',
})
export class PetitionsComponent {
  @Input() trip!: ITripResponse;
  @Output() close = new EventEmitter<void>();

  private participationService = inject(ParticipationsService);
  private snackBar = inject(MatSnackBar);

  joinPetitions!: ITripJoinRequestResponse[];

  subtitulo: string = '';

  // Estado local de expandido/colapsado
  expandedRequests = new Set<number>();

  async ngOnInit() {
    this.subtitulo = `${this.trip.destinyPlace} | ${this.trip.endDate}`;
    this.joinPetitions = await this.participationService.getJoinRequests(this.trip.id);
  }

  onCancel() {
    this.close.emit();
  }

  // Métodos de control
  toggleSolicitud(requestId: number) {
    if (this.expandedRequests.has(requestId)) {
      this.expandedRequests.delete(requestId);
    } else {
      this.expandedRequests.add(requestId);
    }
  }

  isExpanded(requestId: number): boolean {
    return this.expandedRequests.has(requestId);
  }

async aceptarSolicitud(requestId: number, participant: string) {
  await this.participationService.acceptTripRequest(this.trip.id, requestId);
  // Actualizar estado local
  const petition = this.joinPetitions.find(p => p.requestId === requestId);
  if (petition) petition.status = 'accepted';
  this.showWelcomeToast(participant);
}

async rechazarSolicitud(requestId: number, participant: string) {
  await this.participationService.rejectTripRequest(this.trip.id, requestId);
  // Actualizar estado local
  const petition = this.joinPetitions.find(p => p.requestId === requestId);
  if (petition) petition.status = 'rejected';
  this.showRejectToast(participant);
}

  //Mensajes de acciones ACEPTAR y RECHAZAR

  private showWelcomeToast(name: string) {
    this.snackBar.open(`¡${name} ha sido aceptado! 🧳`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }

  private showRejectToast(name: string) {
    this.snackBar.open(`${name} ha sido rechazado...`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
}
