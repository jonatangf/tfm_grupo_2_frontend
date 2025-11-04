import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITrip } from '../interfaces/itrip.interface';
@Injectable({
    providedIn: 'root',
})
export class TripsService {
    private httpClient = inject(HttpClient);

    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//
    private baseUrl: string = '';
    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//

    //Obtener todos los viajes (con filtros opcionales)
    getAllTrips(filters?: {destination?: string; startDate?: string; endDate?: string; price?: number}):    Promise<ITrip[]> {
        //Construye los parametros de la url
        let params = new HttpParams();
        if(filters){
            //Convierte los parametros y los añade a a los parametros 
            Object.entries(filters).forEach(([key, value]) =>{
                if(value)
                    params = params.set(key, value.toString());
            })
        }
        return lastValueFrom(this.httpClient.get<ITrip[]>(this.baseUrl, {params})); 
    }

    //Obtener un viaje por id
    getTripById(id: number): Promise<ITrip> {
        return lastValueFrom(this.httpClient.get<ITrip>(`{this.baseUrl}/${id}`));
    }

    //Crear un nuevo viaje
    createTrip(trip: ITrip): Promise<{success: boolean; tripId: number}>{
        return lastValueFrom(this.httpClient.post<{success: boolean; tripId: number}>(this.baseUrl, trip));
    }

    //Actualizar un viaje
    upadateTrip(trip: ITrip): Promise<{success:boolean}> {
        const {id, ...restTrip} = trip;
        return lastValueFrom(this.httpClient.put<{success: boolean}>(`${this.baseUrl}/${id}`, restTrip));
    }

    //Eliminar un viaje
    removeTrip(id: number): Promise<{success: boolean}>{
        return lastValueFrom(this.httpClient.delete<{success: boolean}>(`{this.baseUrl}/${id}`));
    }
}
