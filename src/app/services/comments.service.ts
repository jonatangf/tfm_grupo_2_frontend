import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IComment, ICommentReply, ICreateComment, ICreateReply } from '../interfaces/icomment.interface';
import { SuccessResponse } from '../types/api-responses';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  /*------------------------------ GET ------------------------------*/
  // Obtener comentarios de un viaje
  getTripComments(tripId: number): Promise<IComment[]> {
    return lastValueFrom(
      this.httpClient.get<IComment[]>(`${this.baseUrl}/trips/${tripId}/comments`)
    );
  }

  // Obtener respuestas de un comentario concreto
  async getCommentReplies(tripId: number, commentId: number): Promise<ICommentReply[]> {
    const rows = await lastValueFrom(
      this.httpClient.get<any[]>(
        `${this.baseUrl}/trips/${tripId}/comments/${commentId}/replies`
      )
    );

    return rows.map((row) => ({
      replyId: row.commentId,
      userId: row.userId,
      user: row.user,
      message: row.message,
    })) as ICommentReply[];
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
