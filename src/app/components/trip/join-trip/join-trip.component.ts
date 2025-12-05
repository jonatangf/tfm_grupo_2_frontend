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

    private async checkUserParticipation(){
        try {
            const myRequests = await this.userService.getMyTripRequests();
            const currentTripReq = myRequests.find(r => r.tripId === this.trip.id);

            if(currentTripReq?.status === 'pending'){
                this.hasRequestPending = true;
            } else if(currentTripReq?.status === 'accepted'){
                this.isParticipant = true;
            } else if(currentTripReq?.status === 'rejected'){
                this.hasRequestPending = false;
                this.isParticipant = false;
            }

        } catch (error) {
            console.error('Error al checkear la solicitud', error);
        } 
    }   

    closePopUp(){
        this.close.emit();
    }

    async requestJoin(){

        await this.checkUserParticipation();

        if(!this.trip.creatorId || this.isParticipant ||this.hasRequestPending) return;
            
        try {
            const response = await this.participationService.createTripRequest(this.trip.id);
            this.hasRequestPending = true;
            this.closePopUp();
        } catch (error) {
            console.error('Error al solicitar unirse al viaje', error);
        }
    }
}
