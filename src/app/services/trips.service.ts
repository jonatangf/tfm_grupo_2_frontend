import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITrip, ITripResponse, ITripFilters } from '../interfaces/itrip.interface';
import { SuccessResponse, CreateTripResponse } from '../types/api-responses'
import { environment } from '../../environments/environments';
@Injectable({
    providedIn: 'root',
})
export class TripsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = environment.apiUrl;

    /*------------------------------ GET ------------------------------*/
    //Obtener todos los viajes (con filtros opcionales)
    getAllTrips(filters? : ITripFilters): Promise<ITripResponse[]> {
        //Construye los parametros de la url
        let params = new HttpParams();

        if(filters){
            //Convierte los parametros y los añade a a los parametros 
            Object.entries(filters).forEach(([key, value]) =>{
                if(value!==undefined && value !== null && value!=='')
                    params = params.set(key, value.toString());
            })
        }
        return lastValueFrom(this.httpClient.get<ITripResponse[]>
                            (`${this.baseUrl}/trips`, {params})); 
    }
    
    //Obtener un viaje por id
    getTripById(tripId: number): Promise<ITripResponse> {
        return lastValueFrom(this.httpClient.get<ITripResponse>
                            (`${this.baseUrl}/trips/${tripId}`));
    }

    /*------------------------------ POST ------------------------------*/
    //Crear un nuevo viaje
    createTrip(trip: ITrip): Promise<CreateTripResponse>{
        return lastValueFrom
        (this.httpClient.post<CreateTripResponse>
        (`${this.baseUrl}/trips`, trip));
    }

    /*------------------------------ PUT ------------------------------*/
    //Actualizar un viaje
    updateTrip(tripId: number, trip: ITrip): Promise<SuccessResponse> {
        return lastValueFrom(this.httpClient.put<SuccessResponse>
                            (`${this.baseUrl}/trips/${tripId}`, trip));
    }

    /*------------------------------ DELETE ------------------------------*/
    //Eliminar un viaje
    removeTrip(tripId: number): Promise<SuccessResponse>{
        return lastValueFrom(this.httpClient.delete<SuccessResponse>
                            (`${this.baseUrl}/trips/${tripId}`));
    }
}