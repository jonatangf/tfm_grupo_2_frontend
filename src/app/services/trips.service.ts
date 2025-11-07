import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITrip, ITripResponse } from '../interfaces/itrip.interface';
@Injectable({
    providedIn: 'root',
})
export class TripsService {
    private httpClient = inject(HttpClient);

    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//
    private baseUrl: string = '';
    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//

    //Obtener todos los viajes (con filtros opcionales)
    getAllTrips(filters?: {destinyPlace?: string; startDate?: string; endDate?: string; max_cost?: number}):    Promise<ITripResponse[]> {
        //Construye los parametros de la url
        let params = new HttpParams();
        if(filters){
            //Convierte los parametros y los añade a a los parametros 
            Object.entries(filters).forEach(([key, value]) =>{
                if(value!==undefined && value !== null && value!=='')
                    params = params.set(key, value.toString());
            })
        }
        return lastValueFrom(this.httpClient.get<ITripResponse[]>(`${this.baseUrl}/trips`, {params})); 
    }

    //Obtener un viaje por id
    getTripById(tripId: number): Promise<ITripResponse> {
        return lastValueFrom(this.httpClient.get<ITripResponse>(`${this.baseUrl}/trips/${tripId}`));
    }

    //Crear un nuevo viaje
    createTrip(trip: ITrip): Promise<{success: boolean; tripId: number}>{
        return lastValueFrom(this.httpClient.post<{success: boolean; tripId: number}>(`${this.baseUrl}/trips`, trip));
    }

    //Actualizar un viaje
    updateTrip(tripId: number, trip: ITrip): Promise<{success:boolean}> {
        return lastValueFrom(this.httpClient.put<{success: boolean}>(`${this.baseUrl}/trips/${tripId}`, trip));
    }

    //Eliminar un viaje
    removeTrip(tripId: number): Promise<{success: boolean}>{
        return lastValueFrom(this.httpClient.delete<{success: boolean}>(`${this.baseUrl}/trips/${tripId}`));
    }
}
