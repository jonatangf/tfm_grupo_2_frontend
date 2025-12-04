import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ICountry } from '../interfaces/icountry.interface';
@Injectable({
  providedIn: 'root',
})
export class CountriesService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = 'https://tfmgrupo2backend-production.up.railway.app/api';

    getCountries(): Promise<ICountry[]>{
        return lastValueFrom(this.httpClient.get<ICountry[]>
                                    (`${this.baseUrl}/countries`)); 
    }
}
