import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { IError } from '../interfaces/ierror';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = '';

  login(user: IUser): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/login`, user));
  }

  register(user:IUser): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/register`, user));
  }
  
}
