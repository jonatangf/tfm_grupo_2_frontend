import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReview, IReviewResponse } from '../interfaces/ireview.interface';
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
    createReview(tripId: number, review: IReview): Promise<{success: boolean}>{
        return lastValueFrom(this.httpClient.post<{success: boolean}>(`${this.baseUrl}/trips/${tripId}/reviews`, review));
    }

    //Obtener las valoraciones recibidas por un usuario
    getUserReviews(userId: number): Promise<IReviewResponse[]>{
        return lastValueFrom(this.httpClient.get<IReviewResponse[]>(`${this.baseUrl}/users/${userId}/reviews`));
    }
}