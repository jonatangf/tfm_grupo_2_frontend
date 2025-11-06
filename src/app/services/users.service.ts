import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/users/iuser';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { IError } from '../interfaces/ierror';
import { ILoginRequest } from '../interfaces/ilogin-request';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = '';

  /*------------------------------ POST ------------------------------*/

  //Post de credenciales para el login
  login(credentials: ILoginRequest): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/login`, credentials));
  }

  //Post de registro de un nuevo usuario
  registerUser(user:IUser): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/register`, user));
  }

  /*------------------------------ PUT ------------------------------*/

  // Actualiza usuario
  updateUserById(user:IUser): Promise<string|IError>{
    return lastValueFrom(this.httpClient.put<string>(`${this.baseUrl}/users/${user.id}`,user))
  }

  /*------------------------------ GET ------------------------------*/

  //Encuentra un usuario por ID
  getUserById(id:number): Promise<IUser|IError>{
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/users/${id}`));
  }

  //Encuentra valoracion media de un usuario por ID
  getUserScore(id:number): Promise<number|IError>{
    return lastValueFrom(this.httpClient.get<number>(`${this.baseUrl}/users/${id}/score`))
  }

}
