export interface ITripMember{
    userId: number;
    name: string; 
    email: string;
}

export interface ITripJoinRequestResponse{
    requestId: number;
    userId: number;
    name: string;
    status: 'pending' | 'accepted' |'rejected';
}