import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IComment, ICreateComment, ICreateReply } from '../interfaces/icomment.interface';
import { SuccessResponse } from '../types/api-responses';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = 'https://tfmgrupo2backend-production.up.railway.app/api';

  /*------------------------------ GET ------------------------------*/
  // Obtener comentarios de un viaje
  getTripComments(tripId: number): Promise<IComment[]> {
    return lastValueFrom(
      this.httpClient.get<IComment[]>(`${this.baseUrl}/trips/${tripId}/comments`)
    );
  }

  /*------------------------------ POST ------------------------------*/
  // Publicar comentario en foro
  createComment(tripId: number, comment: ICreateComment): Promise<{ success: true; commentId: number }> {
    return lastValueFrom(
      this.httpClient.post<{ success: true; commentId: number }>(
        `${this.baseUrl}/trips/${tripId}/comments`,
        comment
      )
    );
  }

  // Responder a un comentario
  replyToComment(
    tripId: number,
    commentId: number,
    reply: ICreateReply
  ): Promise<SuccessResponse> {
    return lastValueFrom(
      this.httpClient.post<SuccessResponse>(
        `${this.baseUrl}/trips/${tripId}/comments/${commentId}/reply`,
        reply
      )
    );
  }
}
