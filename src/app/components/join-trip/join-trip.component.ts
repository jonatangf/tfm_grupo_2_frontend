import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ITripResponse } from '../../interfaces/itrip.interface';
import { DatePipe } from '@angular/common';
import { IUser } from '../../interfaces/users/iuser';
import { UsersService } from '../../services/users.service';
import { ParticipationsService } from '../../services/participations.service';

@Component({
  selector: 'app-join-trip',
  imports: [DatePipe],
  templateUrl: './join-trip.component.html',
  styleUrl: './join-trip.component.css',
})
export class JoinTripComponent {
    userService = inject(UsersService);
    tripCreator: IUser | null = null;
    
    participationService = inject(ParticipationsService);

    @Input() trip!: ITripResponse;
    @Output() close = new EventEmitter<void>();

    isOpen: boolean = false;

    async ngOnInit(){
        if(!this.trip.creatorId) return;
            
        try {
            this.tripCreator = await this.userService.getUserById(this.trip.creatorId);
        } catch (error) {
            console.error('Error al cargar el creador del viaje', error)
        }    
    }

    closePopUp(){
        this.close.emit();
    }

    //TODO: HAY QUE CHECKEAR SI LA REQUEST YA SE HA HECHO PREVIAMENTE
    async requetsJoin(){
        if(!this.trip.creatorId) return;
            
        try {
            const response = await this.participationService.createTripRequest(this.trip.id);

            if(response.success){
                console.log('Solicitud enviada, id', response.requestId);
                this.closePopUp();
            } else{
                console.warn('La API a devuelto succes = false');
            }

        } catch (error) {
            console.error('Error al solicitar unirse al viaje', error);
        }

    }

}
