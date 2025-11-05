export interface IReview {
    toUserId: number;
    score: number;
    comment: string;
}

export interface IReviewResponse {
    from: string;
    score: number;
    comment: string;
}
