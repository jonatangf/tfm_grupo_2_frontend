import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IComment } from '../interfaces/icomment.interface';
@Injectable({
  providedIn: 'root',
})
export class CommentsService {
    private httpClient = inject(HttpClient);

    /*--------------------FALTA PONER URL DE LA API --------------------*/
    private baseUrl: string = '';

    /*------------------------------ GET ------------------------------*/
    //Obterner los comentarios
    getAllComments(tripId: number): Promise<IComment[]>{
        return lastValueFrom(this.httpClient.get<IComment[]>(`${this.baseUrl}/trips/${tripId}/comments`));
    }

    /*------------------------------ POST ------------------------------*/
    //Publicar comentario en foro
    addComments(tripId: number, comment: IComment): Promise<{success: boolean; commentId: number}>{
        const {user, ... message} = comment;
        return lastValueFrom(this.httpClient.post<{success: boolean; commentId:number}>(`${this.baseUrl}/trips/${tripId}/comments`, message));
    }

    //Responder a comentario
    replyComment(tripId: number, commentId: number, comment: IComment): Promise<{success: boolean}>{
        const {user, ... message} = comment;
        return lastValueFrom(this.httpClient.post<{success: boolean}>(`${this.baseUrl}/trips/${tripId}/comments/${commentId}/reply`, message));
    }
}
