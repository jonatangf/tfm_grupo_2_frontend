import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IAccomodation } from '../interfaces/iaccomodation.interface';

@Injectable({
  providedIn: 'root',
})
export class AccomodationsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = 'https://tfmgrupo2backend-production.up.railway.app/api';

    getAccomodations(): Promise<IAccomodation[]>{
        return lastValueFrom(this.httpClient.get<IAccomodation[]>
                                    (`${this.baseUrl}/accommodations`)); 
    }
}
