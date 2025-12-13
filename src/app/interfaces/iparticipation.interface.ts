export interface ITripMember {
    userId: number;
    name: string;
    email: string;
    avatar?: string;
}

export interface ITripJoinRequestResponse {
    requestId: number;
    userId: number;
    name: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface IMyTripRequest{
    tripId: number;
    tripName: string;
    destination: string;
    destinyCountryId: number;
    startDate: string;
    endDate: string;
    status: 'pending' | 'accepted' | 'rejected';
    requestedAt: string;
}