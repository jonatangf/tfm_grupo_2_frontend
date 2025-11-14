import { Component, inject, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { LoginHeaderComponent } from '../login/header/login-header.component';
import { UsersService } from '../../services/users.service';
import { ILoginRequest } from '../../interfaces/ilogin-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LoginComponent, LoginHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild(LoginComponent) loginChild!: LoginComponent; //Permite invocar un método del hijo desde el padre

  private userService = inject(UsersService);
  router = inject(Router);

  loginReq!: ILoginRequest;

  subtitle: string = '¡Bienvenido!';
  // estados posibles: 'initial' | 'login' | 'register'
  state: 'initial' | 'login' | 'register' = 'initial';

  buttonLogin: string = 'INICIAR SESION';
  buttonRegister: string = 'REGISTRARSE';
  buttonBack: string = 'VOLVER';

  loadLogin(mode: 'log' | 'reg') {
    this.state = mode === 'log' ? 'login' : 'register';
    this.subtitle = mode === 'log' ? 'Iniciar sesión' : 'Registro de cuenta';
  }

  goBack() {
    this.state = 'initial';
    this.subtitle = '¡Bienvenido!';
  }

  async onLogin(data: any) {
    this.loginReq = data;
    if (data.username) {
      console.log('register');
      const response: any = await this.userService.registerUser(this.loginReq);
      try {
        //aqui me logado correctamente redirijo dashboard
        if (response.token) {
          //almacenar ese token en el localstorage para poder guardar el estado de logado en la aplicacion.
          console.log(response.token);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/profile']);
        }
      } catch (msg: any) {
        alert(response.error);
      }
    } else {
      console.log('login');
      const response: any = await this.userService.login(this.loginReq);
      try {
        //aqui me logado correctamente redirijo dashboard
        if (response.token) {
          //almacenar ese token en el localstorage para poder guardar el estado de logado en la aplicacion.
          localStorage.setItem('token', response.token);
          this.router.navigate(['/profile']);
        }
      } catch (msg: any) {
        alert(response.error);
      }
    }
    console.log('fin');
  }
}
