import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../../services/comments.service';
import { TripsService } from '../../services/trips.service';
import { IComment, ICreateComment, ICreateReply } from '../../interfaces/icomment.interface';
import { ITripResponse } from '../../interfaces/itrip.interface';
import { TripsHeaderComponent } from '../../components/trip/trips-header/trips-header.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule, TripsHeaderComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commentsService = inject(CommentsService);
  private tripsService = inject(TripsService);

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
      this.trips = await this.tripsService.getAllTrips();
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
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      // Mock data for testing if API fails
      this.comments = this.getMockComments();
    } finally {
      this.loadingComments = false;
    }
  }

  private getMockComments(): IComment[] {
    return [
      {
        commentId: 1,
        user: 'Ana',
        title: 'Bienvenida al viaje',
        message: '¡Hola a todos! Estoy muy emocionada por este viaje. ¿Alguien tiene recomendaciones sobre qué llevar?',
        replies: [
          {
            replyId: 1,
            user: 'Pedro',
            message: '¡Hola Ana! Te recomiendo llevar ropa cómoda y una buena cámara.',
          },
        ],
      },
      {
        commentId: 2,
        user: 'Carlos',
        message: '¿A qué hora nos encontramos en el aeropuerto?',
        replies: [],
      },
    ];
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

      // Recargar comentarios
      await this.loadComments();

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
}

