import { Component, Input } from '@angular/core';
import { ITripResponse } from '../../interfaces/itrip.interface';

@Component({
  selector: 'app-petitions',
  imports: [],
  templateUrl: './petitions.component.html',
  styleUrl: './petitions.component.css',
})
export class PetitionsComponent {

  @Input() trip!: ITripResponse;

  subtitulo: string = 'Subtítulo dinámico'; // lo editas según tu lógica

  solicitudes = [
    { user: { username: 'Carlos' }, expanded: false },
    { user: { username: 'María' }, expanded: false },
    { user: { username: 'Lucía' }, expanded: false }
  ];

  toggleSolicitud(solicitud: any) {
    solicitud.expanded = !solicitud.expanded;
  }
}
