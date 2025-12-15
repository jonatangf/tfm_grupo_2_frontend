import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../../services/comments.service';
import { TripsService } from '../../services/trips.service';
import { UsersService } from '../../services/users.service';
import { IComment, ICreateComment, ICreateReply } from '../../interfaces/icomment.interface';
import { ITripResponse } from '../../interfaces/itrip.interface';
import { TripsHeaderComponent } from '../../components/trip/trips-header/trips-header.component';
import { DateRangePipe } from '../../utils/date-format.pipe';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports:  [DateRangePipe, CommonModule, FormsModule, TripsHeaderComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commentsService = inject(CommentsService);
  private tripsService = inject(TripsService);
  private usersService = inject(UsersService);

  tripId?: number;
  trip: ITripResponse | null = null;
  trips: ITripResponse[] = [];
  comments: IComment[] = [];
  
  // Estados de carga
  loadingTrips = false;
  loadingTrip = false;
  loadingComments = false;
  creatingComment = false;
  replyingToComment: number | null = null;

  // Estados de popups
  showCreateCommentPopup = false;
  showReplyPopup: { [commentId: number]: boolean } = {};

  // Formularios
  newComment: ICreateComment = {
    title: '',
    message: '',
  };

  replyForms: { [commentId: number]: ICreateReply } = {};

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tripId = +params['tripId'];
      if (this.tripId) {
        this.loadTrip();
        this.loadComments();
      } else {
        // If no tripId, load trips list for selection
        this.loadTrips();
      }
    });
  }

  async loadTrips(): Promise<void> {
    try {
      this.loadingTrips = true;
      // Obtener los viajes en los que participa el usuario (solicitudes de unión)
      const [myTripRequests, allTrips] = await Promise.all([
        this.usersService.getMyTripRequests(),
        this.tripsService.getAllTrips(),
      ]);

      const acceptedTripIds = new Set(
        myTripRequests
          .filter((req) => req.status === 'accepted')
          .map((req) => req.tripId)
      );

      // Solo mostrar viajes en los que el usuario es miembro aceptado
      this.trips = allTrips.filter((trip) => acceptedTripIds.has(trip.id));
    } catch (error) {
      console.error('Error cargando viajes:', error);
      this.trips = [];
    } finally {
      this.loadingTrips = false;
    }
  }

  selectTrip(trip: ITripResponse): void {
    this.router.navigate(['/forum', trip.id]);
  }

  async loadTrip(): Promise<void> {
    if (!this.tripId) return;
    try {
      this.loadingTrip = true;
      this.trip = await this.tripsService.getTripById(this.tripId);
    } catch (error) {
      console.error('Error cargando viaje:', error);
      alert('Error al cargar el viaje');
    } finally {
      this.loadingTrip = false;
    }
  }

  async loadComments(): Promise<void> {
    if (!this.tripId) return;
    try {
      this.loadingComments = true;
      this.comments = await this.commentsService.getTripComments(this.tripId);
      await this.loadRepliesForComments();
      await this.enrichCommentsWithAvatars();
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      this.comments = [];
    } finally {
      this.loadingComments = false;
    }
  }

  openCreateCommentPopup(): void {
    this.showCreateCommentPopup = true;
    this.newComment = {
      title: '',
      message: '',
    };
  }

  closeCreateCommentPopup(): void {
    this.showCreateCommentPopup = false;
    this.newComment = {
      title: '',
      message: '',
    };
  }

  async createComment(): Promise<void> {
    if (!this.tripId) return;

    if (!this.newComment.message.trim()) {
      alert('Por favor, ingresa un mensaje');
      return;
    }

    try {
      this.creatingComment = true;
      await this.commentsService.createComment(this.tripId, {
        title: this.newComment.title?.trim() || undefined,
        message: this.newComment.message.trim(),
      });

      // Recargar comentarios
      await this.loadComments();

      // Cerrar popup y resetear formulario
      this.closeCreateCommentPopup();
    } catch (error: any) {
      console.error('Error creando comentario:', error);
      alert(error.error?.message || 'Error al crear el comentario');
    } finally {
      this.creatingComment = false;
    }
  }

  openReplyPopup(commentId: number): void {
    this.showReplyPopup[commentId] = true;
    this.replyForms[commentId] = { message: '' };
  }

  closeReplyPopup(commentId: number): void {
    this.showReplyPopup[commentId] = false;
    delete this.replyForms[commentId];
  }

  async replyToComment(commentId: number): Promise<void> {
    if (!this.tripId) return;

    const reply = this.replyForms[commentId];
    if (!reply || !reply.message.trim()) {
      alert('Por favor, ingresa un mensaje');
      return;
    }

    try {
      this.replyingToComment = commentId;
      await this.commentsService.replyToComment(this.tripId, commentId, {
        message: reply.message.trim(),
      });

      const session = this.usersService.getSession();
      const currentUser = session?.username || 'Tú';
      const currentUserId = session?.userId ?? 0;
      const currentAvatar = (session as any)?.photo as string | undefined;
      const comment = this.comments.find((c) => c.commentId === commentId);
      if (comment) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push({
          replyId: Date.now(),
          userId: currentUserId,
          user: currentUser,
          message: reply.message.trim(),
          createdAt: new Date(),
          avatar: currentAvatar,
        });
      }

      // Cerrar popup y limpiar formulario
      this.closeReplyPopup(commentId);
    } catch (error: any) {
      console.error('Error respondiendo comentario:', error);
      alert(error.error?.message || 'Error al responder el comentario');
    } finally {
      this.replyingToComment = null;
    }
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://api.dicebear.com/7.x/identicon/svg?seed=default';
  }

  getUserAvatar(user: string): string {
    const seed = user;
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goBack(): void {
    if (this.tripId) {
      // If viewing a specific trip's forum, go back to forum trip selector
      this.router.navigate(['/forum']);
    } else {
      // If already at forum selector, go to trips page
      this.router.navigate(['/trips']);
    }
  }

  private async enrichCommentsWithAvatars(): Promise<void> {
    try {
      for (const comment of this.comments) {
        // Avatar del autor del comentario
        if (comment.userId) {
          try {
            const user = await this.usersService.getUserById(comment.userId);
            if (user.avatar) {
              comment.avatar = user.avatar;
            }
          } catch (err) {
            console.error('Error cargando avatar para usuario', comment.userId, err);
          }
        }

        // Avatares de las respuestas
        if (comment.replies) {
          for (const reply of comment.replies) {
            if (reply.userId) {
              try {
                const user = await this.usersService.getUserById(reply.userId);
                if (user.avatar) {
                  reply.avatar = user.avatar;
                }
              } catch (err) {
                console.error('Error cargando avatar para usuario', reply.userId, err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error enriqueciendo comentarios con avatares:', error);
    }
  }

  private async loadRepliesForComments(): Promise<void> {
    if (!this.tripId) return;

    for (const comment of this.comments) {
      try {
        const replies = await this.commentsService.getCommentReplies(
          this.tripId,
          comment.commentId
        );
        comment.replies = replies;
      } catch (err) {
        console.error('Error cargando respuestas para comentario', comment.commentId, err);
      }
    }
  }
}
