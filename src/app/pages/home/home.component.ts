import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  imports: [LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  login:boolean = false;
  register:boolean = false;
  button1:string = 'INICIAR SESION';
  button2:string = 'REGISTRARSE';


loadLogin(btn: string) {
  this.login = true; // siempre que pulses, entras en modo login
  this.register = btn === 'reg'; // true si es registro, false si es login
}

}
