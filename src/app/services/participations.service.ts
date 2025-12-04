import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITripMember, ITripJoinRequestResponse } from '../interfaces/iparticipation.interface';
import { SuccessResponse, CreateTripRequestResponse } from '../types/api-responses'
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root',
})
export class ParticipationsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = environment.apiUrl;
    
    /*------------------------------ GET ------------------------------*/
    //Obtener los miembros aceptados
    getTripMembers(tripId: number): Promise<ITripMember[]>{
        return lastValueFrom(this.httpClient.get<ITripMember[]>
                            (`${this.baseUrl}/trips/${tripId}/members`));
    }

    //Obtener lista de solicitudes (solo lo hace el creador)
    getJoinRequests(tripId: number): Promise<ITripJoinRequestResponse[]>{
        return lastValueFrom(this.httpClient.get<ITripJoinRequestResponse[]>
                            (`${this.baseUrl}/trips/${tripId}/requests`));
    }

    /*------------------------------ POST ------------------------------*/
    //Solicitar unirse al viaje
    createTripRequest(tripId: number): Promise<CreateTripRequestResponse>{
        return lastValueFrom(this.httpClient.post<CreateTripRequestResponse>(`${this.baseUrl}/trips/${tripId}/join-request`, {}));
    }

    //Aceptar solictud
    acceptTripRequest(tripId: number, requestId: number): Promise<SuccessResponse>{
        return lastValueFrom(this.httpClient.post<SuccessResponse>(`${this.baseUrl}/trips/${tripId}/requests/${requestId}/accept`,{}));        
    }

    //Rechazar solictud
    rejectTripRequest(tripId: number, requestId: number): Promise<SuccessResponse>{
        return lastValueFrom(this.httpClient.post<SuccessResponse>(`${this.baseUrl}/trips/${tripId}/requests/${requestId}/reject`,{}));        
    }
}
