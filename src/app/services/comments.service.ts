import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IComment } from '../interfaces/icomment.interface';
import { SuccessResponse, AddCommentResponse } from '../types/api-responses'
@Injectable({
  providedIn: 'root',
})
export class CommentsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = 'http://localhost:3000/api';

    /*------------------------------ GET ------------------------------*/
    //Obterner los comentarios
    getAllComments(tripId: number): Promise<IComment[]>{
        return lastValueFrom(this.httpClient.get<IComment[]>(`${this.baseUrl}/trips/${tripId}/comments`));
    }

    /*------------------------------ POST ------------------------------*/
    //Publicar comentario en foro
    addComments(tripId: number, comment: IComment): Promise<AddCommentResponse>{
        const {user, ... message} = comment;
        return lastValueFrom(this.httpClient.post<AddCommentResponse>(`${this.baseUrl}/trips/${tripId}/comments`, message));
    }

    //Responder a comentario
    replyComment(tripId: number, commentId: number, comment: IComment): Promise<SuccessResponse>{
        const {user, ... message} = comment;
        return lastValueFrom(this.httpClient.post<SuccessResponse>(`${this.baseUrl}/trips/${tripId}/comments/${commentId}/reply`, message));
    }
}
