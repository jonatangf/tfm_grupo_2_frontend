import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/users/iuser';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { IError } from '../interfaces/ierror';
import { ILoginRequest } from '../interfaces/ilogin-request';
import { ISession } from '../interfaces/users/isession';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = 'http://localhost:3000/api';
  private authResponse!: ILoginResponse;
  private authError!: IError;
  private session: ISession | null = null;

  /*------------------------------ POST ------------------------------*/

  //Post de credenciales para el login
  /*login(credentials: ILoginRequest): Promise<ILoginResponse | IError> {
    return lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/auth/login`, credentials));
  }*/

    async login(credentials: ILoginRequest): Promise<ISession | IError> {
    try {
      const response = await lastValueFrom(
        this.httpClient.post<ILoginResponse>(`${this.baseUrl}/auth/login`, credentials)
      );
      console.log(response);
      // Destructuring para construir ISession
      const { id, name, email, photo } = response.user;
      this.session = { id, name, email, photo };

      // Persistencia del token
      localStorage.setItem('token', response.token);
      localStorage.setItem('session', JSON.stringify(this.session));
      console.log('Accedemos con sesion');
      console.log(this.session);
      return this.session;

    } catch (error) {
      return this.authError;
    }
  }

  getSession(): ISession | null {
    if (!this.session) {
      const stored = localStorage.getItem('session');
      if (stored) this.session = JSON.parse(stored);
    }
    return this.session;
  }

  logout() {
    this.session = null;
    localStorage.removeItem('token');
    localStorage.removeItem('session');
  }
  

  //Post de registro de un nuevo usuario
  async registerUser(credentials:ILoginRequest): Promise<ILoginResponse | IError> {
    this.authResponse = await lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/auth/register`, credentials));
    if(this.authResponse.success){
      const { email, password } = credentials;
      const loginData = { email, password };
      const resultado = await lastValueFrom(this.httpClient.post<ILoginResponse>(`${this.baseUrl}/auth/login`, loginData));
      return resultado;
    }
    return this.authError;
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
