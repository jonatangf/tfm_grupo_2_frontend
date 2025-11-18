import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/users/iuser';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { ILoginRequest } from '../interfaces/ilogin-request';
import { ISession } from '../interfaces/users/isession';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = 'http://localhost:3000/api';
  private session: ISession | null = null;
  private userOnline!: IUser;

  /*------------------------------ POST ------------------------------*/

  async login(credentials: ILoginRequest): Promise<ISession> {
    const response = await lastValueFrom(
      this.httpClient.post<ILoginResponse>(`${this.baseUrl}/auth/login`, credentials)
    );
    // Persistencia del token
    localStorage.setItem('token', response.token);
    //Recuperamos usuario logeado
    this.userOnline = await this.getUserById(response.userId);

    // Destructuring para construir ISession
    const { id: userId, username, email, photo } = this.userOnline;
    this.session = { userId, username, email, photo };
    // Persistencia del session
    localStorage.setItem('session', JSON.stringify(this.session));
    return this.session;
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
  async registerUser(credentials: ILoginRequest): Promise<ISession> {
    await lastValueFrom(
      this.httpClient.post<ILoginResponse>(`${this.baseUrl}/auth/register`, credentials)
    );
    const { email, password } = credentials;
    const loginData = { email, password };
    return await this.login(credentials);
  }

  /*------------------------------ PUT ------------------------------*/

  // Actualiza usuario
  updateUserById(user: IUser): Promise<string> {
    return lastValueFrom(this.httpClient.put<string>(`${this.baseUrl}/users/${user.id}`, user));
  }

  /*------------------------------ GET ------------------------------*/

  //Encuentra un usuario por ID
  getUserById(id: number): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/users/${id}`));
  }

  //Encuentra valoracion media de un usuario por ID
  getUserScore(id: number): Promise<number> {
    return lastValueFrom(this.httpClient.get<number>(`${this.baseUrl}/users/${id}/score`));
  }
}
