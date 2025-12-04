import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IAccomodation } from '../interfaces/iaccomodation.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AccomodationsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = environment.apiUrl;

    getAccomodations(): Promise<IAccomodation[]>{
        return lastValueFrom(this.httpClient.get<IAccomodation[]>
                                    (`${this.baseUrl}/accommodations`)); 
    }
}
