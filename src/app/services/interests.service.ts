import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IInterest } from '../interfaces/iInterest.interface';
import { SuccessResponse } from '../types/api-responses';
import { environment } from '../../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class InterestsService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;

  getInterests(): Promise<IInterest[]> {
    return lastValueFrom(this.httpClient.get<IInterest[]>(`${this.baseUrl}/interests`));
  }

  postInterestsByUser(userId:number): Promise<SuccessResponse> {
    return lastValueFrom(this.httpClient.get<SuccessResponse>(`${this.baseUrl}/interests/${userId}`));
  }
}
