import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { TripListMode } from '../../../types/trip-types';
import { DateRangePipe } from '../../../utils/date-format.pipe';
import { CommonModule } from '@angular/common';
import { ParticipationsService } from '../../../services/participations.service';
import { UsersService } from '../../../services/users.service';
import { ISession } from '../../../interfaces/users/isession';
@Component({
  selector: 'app-trips-card',
  imports: [DateRangePipe, CommonModule],
  templateUrl: './trips-card.component.html',
  styleUrl: './trips-card.component.css',
})
export class TripCardComponent {
    @Input() trip!: ITripResponse;
    @Input() mode: TripListMode = 'available';

    @Output() joinClicked = new EventEmitter<void>();
    @Output() deleteClicked = new EventEmitter<void>();
    @Output() detailClicked =  new EventEmitter<void>();
    @Output() requestClicked = new EventEmitter<ITripResponse>();
    @Output() editClicked = new EventEmitter<void>();

    userService = inject(UsersService);
    participationService = inject(ParticipationsService);
    isParticipant: boolean = false;

    sesionData: ISession | null = {
        userId: -1,
        username: '',
        email: '',
        photo: '',
    };

    ngOnInit(){
        this.participationStatus();
        this.getSessionData();
    }

    joinPopUp(){
        this.joinClicked.emit();
    }

    viewDetails(){
        this.detailClicked.emit();
    }

    editTrip(){
        this.editClicked.emit();
    }

    deleteTrip(){
        this.deleteClicked.emit();
    }
    
    showRequests(){
        this.requestClicked.emit(this.trip);
    }

    getSessionData() {
        this.sesionData = this.userService.getSession();
    }

    statusLabel(): string {
        switch (this.trip.status){
            case 'open': 
                return 'Abierto';
            case 'closed':
                return 'Cerrado';
            case 'finished':
                return 'Finalizado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return '';
        }
    }

    participationLabel(): string | null {
        if(!this.isParticipant) return null;
        switch(this.trip.status){
            case 'open': 
            case 'closed':
                return 'Participando';
            case 'finished':
                return 'Participaste';
            case 'cancelled':
                return null;
            default:
                return null;
        }
    }

    async participationStatus() {
        const participants = await this.participationService.getTripMembers(this.trip.id);
        if(participants){
            this.isParticipant = participants.some( p => (p.userId === this.sesionData?.userId));
        }
    }
}
