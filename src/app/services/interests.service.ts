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
    const result = lastValueFrom(this.httpClient.get<IInterest[]>(`${this.baseUrl}/interests`));
    console.log(result)
    return result
  }

  postInterestsByUser(userId:number): Promise<SuccessResponse> {
    return lastValueFrom(this.httpClient.get<SuccessResponse>(`${this.baseUrl}/interests/${userId}`));
  }
}
