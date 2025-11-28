import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { IUser } from '../../../interfaces/users/iuser';
import { UsersService } from '../../../services/users.service';
import { ParticipationsService } from '../../../services/participations.service';
import { DateRangePipe } from '../../../utils/date-format.pipe';
@Component({
  selector: 'app-join-trip',
  imports: [DateRangePipe],
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
    hasRequestPending: boolean = false;
    isParticipant: boolean = false;

    async ngOnInit(){
        if(!this.trip.creatorId) return;
        
        this.tripCreator = await this.userService.getUserById(this.trip.creatorId); 

        await this.checkUserParticipation();
    }

    async checkUserParticipation(){
        try {
            const session = this.userService.getSession()
            const currentUserId = session?.userId;
            if(!currentUserId) return; 

            //Obtener los miembros del viaje
            const members = await this.participationService.getTripMembers(this.trip.id);
            this.isParticipant = members.some(member => member.userId === currentUserId);

            //TODO: Si no es miembro comprobar solicitudes pendientes
            if(!this.isParticipant){
                //const requests = await this.participationService.getJoinRequests(this.trip.id);
                //this.hasRequestPending = requests.some(req=> req.userId === currentUserId)
            }
        } catch (error) {
            console.error('Error al checkear la solicitud', error);
        } 
    }   

    closePopUp(){
        this.close.emit();
    }

    async requetsJoin(){

        this.checkUserParticipation();

        if(!this.trip.creatorId || this.hasRequestPending || this.isParticipant) return;
            
        try {
            const response = await this.participationService.createTripRequest(this.trip.id);
            this.hasRequestPending = true;
            this.closePopUp();
        } catch (error) {
            console.error('Error al solicitar unirse al viaje', error);
        }
    }
}
