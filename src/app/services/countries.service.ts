import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ICountry } from '../interfaces/icountry.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = environment.apiUrl;

    getCountries(): Promise<ICountry[]>{
        return lastValueFrom(this.httpClient.get<ICountry[]>
                                    (`${this.baseUrl}/countries`)); 
    }
}
