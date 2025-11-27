import { Component, inject, Input } from '@angular/core';
import { ITripResponse } from '../../interfaces/itrip.interface';
import { TripsService } from '../../services/trips.service';
import { ParticipationsService } from '../../services/participations.service';
import { ITripJoinRequestResponse } from '../../interfaces/iparticipation.interface';

@Component({
  selector: 'app-petitions',
  imports: [],
  templateUrl: './petitions.component.html',
  styleUrl: './petitions.component.css',
})
export class PetitionsComponent {

  @Input() trip!: ITripResponse;

  private tripsService = inject(TripsService);
  private participationService = inject(ParticipationsService);

  private joinPetitions! : ITripJoinRequestResponse[];

  subtitulo: string = 'Subtítulo dinámico'; // lo editas según tu lógica

  async ngOnInit(){
    this.joinPetitions = await this.participationService.getJoinRequests(this.trip.id); 
  }

  solicitudes = [
    { user: { username: 'Carlos' }, expanded: false },
    { user: { username: 'María' }, expanded: false },
    { user: { username: 'Lucía' }, expanded: false }
  ];

  toggleSolicitud(solicitud: any) {
    solicitud.expanded = !solicitud.expanded;
  }

  aceptarSolicitud(requestId:number){
    console.log('aceptar');
    console.log(requestId);
  }

  rechazarSolicitud(event:Event){
    console.log(event);
  }
}
