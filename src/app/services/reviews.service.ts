import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IReview, IReviewResponse } from '../interfaces/ireview.interface';
import { lastValueFrom } from 'rxjs';
import { SuccessResponse } from '../types/api-responses'
@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = 'https://tfmgrupo2backend-production.up.railway.app/api';

    /*------------------------------ GET ------------------------------*/
    //Obtener las valoraciones recibidas por un usuario
    getUserReviews(userId: number): Promise<IReviewResponse[]>{
        return lastValueFrom(this.httpClient.get<IReviewResponse[]>
                            (`${this.baseUrl}/users/${userId}/reviews`));
    }

    /*------------------------------ POST ------------------------------*/
    //Crear valoracion
    createReview(tripId: number, review: IReview): 
    Promise<SuccessResponse>{
        return lastValueFrom(this.httpClient.post<SuccessResponse>
        (`${this.baseUrl}/trips/${tripId}/reviews`, review));
    }
}