import { Component, inject, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { LoginHeaderComponent } from "../login/header/login-header.component";
import { UsersService } from '../../services/users.service';
import { ILoginRequest } from '../../interfaces/ilogin-request';

@Component({
  selector: 'app-home',
  imports: [LoginComponent, LoginHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  @ViewChild(LoginComponent) loginChild!: LoginComponent; //Permite invocar un método del hijo desde el padre

  private userService = inject(UsersService);
  loginReq! : ILoginRequest;

  subtitle:string='¡Bienvenido!'
  // estados posibles: 'initial' | 'login' | 'register'
  state: 'initial' | 'login' | 'register' = 'initial';

  buttonLogin: string = 'INICIAR SESION';
  buttonRegister: string = 'REGISTRARSE';
  buttonBack: string = 'VOLVER';

  loadLogin(mode: 'log' | 'reg') {
    this.state = mode === 'log' ? 'login' : 'register';
    this.subtitle = mode === 'log' ? 'Iniciar sesión' : 'Registro de cuenta'
  }

  goBack() {
    this.state = 'initial';
    this.subtitle = '¡Bienvenido!';
  }

  onLogin(data: any) {
    this.loginReq = data;
    if(data.name){
      console.log('register');
      this.userService.registerUser(this.loginReq);
    }else{
      console.log('login');
      this.userService.login(this.loginReq);
    }
    console.log('fin');
  }
}

