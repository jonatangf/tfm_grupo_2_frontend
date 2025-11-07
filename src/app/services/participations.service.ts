import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITripMember, ITripJoinRequest } from '../interfaces/iparticipation.interface';
@Injectable({
  providedIn: 'root',
})
export class ParticipationsService {
    private httpClient = inject(HttpClient);
    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//
    private baseUrl: string = '';
    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//

    //Obtener los miembros aceptados
    getTripMembers(tripId: number): Promise<ITripMember[]>{
        return lastValueFrom(this.httpClient.get<ITripMember[]>(`${this.baseUrl}/trips/${tripId}/members`));
    }

    //Obtener lista de solicitudes (solo lo hace el creador)
    getJoinRequests(tripId: number): Promise<ITripJoinRequest[]>{
        return lastValueFrom(this.httpClient.get<ITripJoinRequest[]>(`${this.baseUrl}/trips/${tripId}/requests`));
    }

    //Solicitar unirse al viaje
    createTripRequest(tripId: number): Promise<{success: boolean; requestId: number}>{
        return lastValueFrom(this.httpClient.get<{success: boolean; requestId: number}>(`${this.baseUrl}/trips/${tripId}/join-request`));
    }

    //Aceptar solictud
    acceptTripRequest(tripId: number, requestId: number): Promise<{success:boolean}>{
        return lastValueFrom(this.httpClient.get<{success: boolean}>(`${this.baseUrl}/trips/${tripId}/request/${requestId}/accept`));        
    }

    //Rechazar solictud
    rejectTripRequest(tripId: number, requestId: number): Promise<{success:boolean}>{
        return lastValueFrom(this.httpClient.get<{success: boolean}>(`${this.baseUrl}/trips/${tripId}/request/${requestId}/reject`));        
    }
}
