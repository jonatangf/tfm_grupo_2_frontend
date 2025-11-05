export interface ITrip {
    id?: number;
    name: string;
    description: string;
    destinyPlace: string;
    itinerary: string;
    meansOfTransportsId: number; //Supongo que sera el id del enum de trasnsportes que tengamos
    startDate: string;
    endDate: string;
    creatorId: number;
    accommodationsId: number;
    costPerPerson: number;
    minParticipants: number;
    status: 'open' | 'closed' | 'completed' | 'cancelled';
}

export interface ITripResponse{
    id: number;
    name: string;
    description: string;
    destinyPlace: string;
    itinerary: string;
    meansOfTransportsId: number;
    startDate: string;
    endDate: string;
    creatorId: number;
    accommodationsId: number;
    costPerPerson: number;
    minParticipants: number;
    status: 'open' | 'closed' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    participantsId: number[];
}
