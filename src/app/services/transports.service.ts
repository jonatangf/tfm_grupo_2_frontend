import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITransport } from '../interfaces/itransport.interface';
@Injectable({
  providedIn: 'root',
})
export class TransportsService {
    private httpClient = inject(HttpClient);
    private baseUrl: string = 'http://localhost:3000/api';

    getTransports(): Promise<ITransport[]>{
        return lastValueFrom(this.httpClient.get<ITransport[]>
                                    (`${this.baseUrl}/means_of_transports`)); 
    }
}
