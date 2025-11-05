export interface ITrip {
    id?: number;
    name: string;
    description?: string;
    destinyCountryId?: number;
    destinyPlace: string;
    itinerary?: string;
    meansOfTransportsId?: number;
    startDate?: string;
    endDate?: string;
    creatorId: number;
    accommodationsId?: number;
    costPerPerson?: number;
    minParticipants: number;
    //maxParticipants: number;
    status?: 'open' | 'closed' | 'completed' | 'cancelled';
    //status?: 'draft' | 'published' | 'full' | 'finished' | 'archived';
    createdAt?: string;
    updatedAt?: string;  
}
