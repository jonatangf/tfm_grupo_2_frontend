import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/users/iuser';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { IError } from '../interfaces/ierror';
import { ISingleNumberResponse } from '../interfaces/users/isingle-number-response';
import { ILoginRequest } from '../interfaces/ilogin-request';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = '';


  /* POST */

  //Post de credenciales para el login
  login(credentials: ILoginRequest): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/login`, credentials));
  }

  //Post de registro de un nuevo usuario
  register(user:IUser): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/register`, user));
  }

  /* GET */

  //Encuentra un usuario por ID
  getUserById(id:number): Promise<IUser|IError>{
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/users/${id}`));
  }

/**
 * Método que devuelve el atributo numérico 'param' de un usuario de la tabla 'id'
 * @param id    --> Identificador único de un usuario
 * @param param --> Atributo de IUser a recuperar
 * @returns 
 */
  getNumberParamById(id:number,param:string): Promise<ISingleNumberResponse|IError>{
    return lastValueFrom(this.httpClient.get<ISingleNumberResponse>(`${this.baseUrl}/users/${id}/${param}`))
  }

}
