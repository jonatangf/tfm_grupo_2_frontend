import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReview } from '../interfaces/ireview.interface';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
    private httpClient = inject(HttpClient);

    //--------------------------------FALTA PONER URL DE LA API -----------------------------------//
    private baseUrl: string = '';
    //--------------------------------FALTA PONER URL DE LA API -----------------------------------// 

    //Crear valoracion
    createReview(tripId: number, review: IReview): Promise<{success: true}>{
        const {usersId, tripsId, ...restReview} = review;
        return lastValueFrom(this.httpClient.post<{success: true}>(`${this.baseUrl}/trips/${tripId}/reviews`, restReview));
    }

    //Obtener las valoraciones recibidas por un usuario
    getUserReviews(userId: number): Promise<IReview[]>{
        return lastValueFrom(this.httpClient.get<IReview[]>(`${this.baseUrl}/users/${userId}/reviews`));
    }
}