import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { LoginHeaderComponent } from "../login/header/login-header.component";

@Component({
  selector: 'app-home',
  imports: [LoginComponent, LoginHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

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
}

