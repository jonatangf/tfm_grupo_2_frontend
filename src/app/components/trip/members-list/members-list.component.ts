import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipationsService } from '../../../services/participations.service';
import { ReviewsService } from '../../../services/reviews.service';
import { ITripMember } from '../../../interfaces/iparticipation.interface';
import { IReview, IReviewResponse } from '../../../interfaces/ireview.interface';
import { ITripResponse } from '../../../interfaces/itrip.interface';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.css',
})
export class MembersListComponent implements OnInit {
  private participationsService = inject(ParticipationsService);
  private reviewsService = inject(ReviewsService);
  private usersService = inject(UsersService);

  @Input() tripId?: number;
  @Input() trip?: ITripResponse;
  @Output() close = new EventEmitter<void>();

  members: ITripMember[] = [];
  selectedMember: ITripMember | null = null;
  memberReviews: IReviewResponse[] = [];

  loadingMembers = false;
  loadingReviews = false;
  creatingReview = false;

  showCreateReviewForm = false;
  reviewForm = {
    score: 0,
    title: '',
    comment: '',
  };
  hoverScore = 0;

  showMembersView = true;
  showReviewsView = false;

  ngOnInit(): void {
    this.loadMembers();
  }

  async loadMembers(): Promise<void> {
    if (!this.tripId) {
      console.error('tripId no está definido');
      return;
    }
    try {
      this.loadingMembers = true;
      this.members = await this.participationsService.getTripMembers(this.tripId);
      await this.enrichMembersWithAvatars();
    } catch (error) {
      console.error('Error cargando miembros:', error);
      alert('Error al cargar los miembros del viaje');
      this.members = [];
    } finally {
      this.loadingMembers = false;
    }
  }

  private async enrichMembersWithAvatars(): Promise<void> {
    const promises = this.members.map(async (member) => {
      // Si ya tiene avatar, no hacemos nada
      if (member.avatar) return;
      try {
        const user = await this.usersService.getUserById(member.userId);
        const avatar = (user as any).photo ?? (user as any).avatar ?? null;
        if (avatar) {
          member.avatar = avatar;
        }
      } catch (error) {
        console.error('Error cargando avatar del miembro', member.userId, error);
      }
    });

    await Promise.all(promises);
  }

  async selectMember(member: ITripMember): Promise<void> {
    this.selectedMember = member;
    this.showMembersView = false;
    this.showReviewsView = true;
    this.showCreateReviewForm = false;
    await this.loadMemberReviews(member.userId);
  }

  async loadMemberReviews(userId: number): Promise<void> {
    try {
      this.loadingReviews = true;
      this.memberReviews = await this.reviewsService.getUserReviews(userId);
    } catch (error) {
      console.error('Error cargando reviews:', error);
      alert('Error al cargar las reseñas del usuario');
    } finally {
      this.loadingReviews = false;
    }
  }

  goBackToMembers(): void {
    this.showReviewsView = false;
    this.showCreateReviewForm = false;
    this.showMembersView = true;
    this.selectedMember = null;
    this.memberReviews = [];
  }

  openCreateReviewForm(): void {
    if (!this.selectedMember) return;
    this.showCreateReviewForm = true;
    this.reviewForm = {
      score: 0,
      title: '',
      comment: '',
    };
  }

  setScore(score: number): void {
    this.reviewForm.score = score;
  }

  async createReview(): Promise<void> {
    if (!this.selectedMember) return;

    if (!this.tripId) {
      alert('Error: No se ha especificado el ID del viaje');
      return;
    }

    if (this.reviewForm.score === 0) {
      alert('Por favor, selecciona una puntuación');
      return;
    }

    if (!this.reviewForm.title.trim()) {
      alert('Por favor, ingresa un título para la reseña');
      return;
    }

    if (!this.reviewForm.comment.trim()) {
      alert('Por favor, ingresa un comentario');
      return;
    }

    try {
      this.creatingReview = true;
      const review: IReview = {
        toUserId: this.selectedMember.userId,
        score: this.reviewForm.score,
        title: this.reviewForm.title,
        comment: this.reviewForm.comment,
      };

      await this.reviewsService.createReview(this.tripId, review);

      await this.loadMemberReviews(this.selectedMember.userId);
      this.showCreateReviewForm = false;
      this.reviewForm = {
        score: 0,
        title: '',
        comment: '',
      };

      alert('Reseña creada exitosamente');
    } catch (error: any) {
      console.error('Error creando review:', error);
      alert(error.error?.message || 'Error al crear la reseña');
    } finally {
      this.creatingReview = false;
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  getMemberAvatar(member: ITripMember): string {
    // Si el backend ya envía avatar para el miembro, úsalo
    if (member.avatar) {
      return member.avatar;
    }
    // Fallback actual: avatar generado por Dicebear
    const seed = member.name;
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(String(seed))}`;
  }

  // TODO: en el futuro, poblar `avatar` en cada review desde el usuario (GET /users/:id)
  // y usar directamente la URL real aquí en lugar del identicon de fallback.
  getReviewAvatar(review: IReviewResponse): string {
    // Si el backend envía avatar para el autor de la reseña, úsalo
    if (review.avatar) {
      return review.avatar;
    }
    // Fallback actual: avatar generado por Dicebear en base al nombre
    const seed = review.from;
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(String(seed))}`;
  }

  getMemberFullName(member: ITripMember): string {
    return member.name;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

