export interface IReview {
    id?: number;
    usersId: number;
    tripsId: number;
    reviewedUserId: number;
    review: string;
    score: number;
    createdAt?: string;
    updatedAt?: string;
}
