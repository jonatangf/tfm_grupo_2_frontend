export interface IReview {
    usersId?: number;
    tripsId: number;
    reviewedUserId: number;
    review: string;
    score: number;
    createdAt?: string;
    updatedAt?: string;
}
