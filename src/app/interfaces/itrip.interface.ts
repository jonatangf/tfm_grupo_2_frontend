export interface ITrip {
    name: string;
    description: string;
    destinyCountryId: number;
    destinyPlace: string;
    destinyImage: string;
    itinerary: string;
    meansOfTransportsId: number; 
    startDate: string;
    endDate: string;
    creatorId: number;
    accommodationsId: number;
    costPerPerson: number;
    minParticipants: number;
    status: 'open' | 'closed' | 'finished' | 'cancelled';
}

export interface ITripResponse{
    id: number;
    name: string;
    description: string;
    destinyCountryId: number;
    destinyPlace: string;
    destinyImage: string;
    itinerary: string;
    meansOfTransportsId: number;
    startDate: string;
    endDate: string;
    creatorId: number;
    accommodationsId: number;
    costPerPerson: number;
    minParticipants: number;
    status: 'open' | 'closed' | 'finished' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface ITripFilters {
    destination?: string;
    startDate?: string;
    endDate?: string;
    price?: number | null;
}


export interface TripsResponse {
  data: ITripResponse[];
  limit: number;
  offset: number;
}
