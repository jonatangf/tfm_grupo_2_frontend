import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { DatePipe } from '@angular/common';
import { MembersListComponent } from '../../../components/trip/members-list/members-list.component';
import { CommonModule } from '@angular/common';
import { TripListMode } from '../../../types/trip-types';
@Component({
  selector: 'app-detail-trip',
  imports: [DatePipe, MembersListComponent, CommonModule],
  templateUrl: './detail-trip.component.html',
  styleUrl: './detail-trip.component.css',
})
export class DetailTripComponent {
    @Input() trip!: ITripResponse;
    @Input() tripMode!: TripListMode;
    
    @Output() editFormClicked = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    showMembersList = false;

    closePopUp(){
        this.close.emit();
    }

    editTrip(){
        this.editFormClicked.emit();
    }

    toggleMembersList(){
        this.showMembersList = !this.showMembersList;
    }

    closeMembersList(){
        this.showMembersList = false;
    }
}
