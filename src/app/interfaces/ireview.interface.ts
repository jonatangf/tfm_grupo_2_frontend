export interface IReview {
    toUserId: number;
    score: number;
    title: string;
    comment: string;
}

export interface IReviewResponse {
    from: string;
    title: string;
    score: number;
    comment: string;
    createdAt: string;
    avatar?: string;
}
