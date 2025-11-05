export interface ITripMember{
    userId: number;
    name: string; 
    email: string;
}

export interface ITripJoinRequest{
    requestId: number;
    userId: number;
    name: string;
    status: 'pending' | 'accepted' |'rejected';
}