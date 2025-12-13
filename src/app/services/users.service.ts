import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/users/iuser';
import { ILoginResponse } from '../interfaces/ilogin-response';
import { ILoginRequest } from '../interfaces/ilogin-request';
import { ISession } from '../interfaces/users/isession';
import { IMyTripRequest } from '../interfaces/iparticipation.interface';
import { environment } from '../../environments/environments';
import { IInterest } from '../interfaces/iInterest.interface';
import { IAvatar } from '../interfaces/users/iavatar';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl: string = environment.apiUrl;
  private publicBaseUrl: string = environment.publicUrl;
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
    const { id: userId, username, email, avatar } = this.userOnline;
    this.session = { userId, username, email, photo: avatar };

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

  setSessionPhoto(avatar: string | null): void {
    if (avatar) {
      const stored = localStorage.getItem('session');
      if (stored) this.session = JSON.parse(stored);
      this.session!.photo = avatar;
      localStorage.setItem('session', JSON.stringify(this.session));
    }
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
    return await this.login(credentials);
  }

  /*------------------------------ PUT ------------------------------*/

  // Actualiza usuario
  updateUserById(user: IUser): Promise<boolean> {
    const result = lastValueFrom(
      this.httpClient.patch<boolean>(`${this.baseUrl}/users/${user.id}`, user)
    );
    return result;
  }

  /*------------------------------ GET ------------------------------*/

  //Encuentra un usuario por ID
  async getUserById(id: number): Promise<IUser> {
    const result = await lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/users/${id}`));
    // El avatar esta en la ruta relativa del back
    if (result.avatar && result.avatar.startsWith('/')) {
      result.avatar = `${this.publicBaseUrl}${result?.avatar}`;
    }
    return result;
  }

  //Encuentra valoracion media de un usuario por ID
  getUserScore(id: number): Promise<number> {
    return lastValueFrom(this.httpClient.get<number>(`${this.baseUrl}/users/${id}/score`));
  }

  getInterests(userId: number): Promise<IInterest[]> {
    return lastValueFrom(
      this.httpClient.get<IInterest[]>(`${this.baseUrl}/interests/user/${userId}`)
    );
  }

  async uploadUserAvatar(id: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    const result = lastValueFrom(
      this.httpClient.put<IAvatar>(`${this.baseUrl}/users/me/avatar`, formData)
    );
    return (await result).avatar;
  }

  //Obtiene todas mis solicitudes a union de viajes
  async getMyTripRequests(): Promise<IMyTripRequest[]> {
    return lastValueFrom(
      this.httpClient.get<IMyTripRequest[]>(`${this.baseUrl}/users/me/trip-requests`)
    );
  }
}
