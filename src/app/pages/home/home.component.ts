import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { LoginHeaderComponent } from '../login/header/login-header.component';
import { UsersService } from '../../services/users.service';
import { ILoginRequest } from '../../interfaces/ilogin-request';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [LoginComponent, LoginHeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild(LoginComponent) loginChild!: LoginComponent; //Permite invocar un método del hijo desde el padre

  private userService = inject(UsersService);
  router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginReq!: ILoginRequest;

  subtitle: string = '¡Bienvenido!';
  // estados posibles: 'initial' | 'login' | 'register'
  state: 'initial' | 'login' | 'register' = 'initial';

  buttonLogin: string = 'INICIAR SESION';
  buttonRegister: string = 'REGISTRARSE';
  buttonBack: string = 'VOLVER';

  
  ngOnInit(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

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
    if (this.state === 'register'){
      const response: any = await this.userService.registerUser(this.loginReq);
      if (response.userId) {
        this.showWelcomeToast(response.username || 'Usuario');
        this.router.navigate(['/trips']);
      }
    } else if (this.state === 'login'){
      const response: any = await this.userService.login(this.loginReq);
      if (response.userId) {
        this.router.navigate(['/trips']);
      }
    }
  }

    private showWelcomeToast(name: string) {
    this.snackBar.open(`¡Bienvenido, ${name}! 🎉`, 'Cerrar', {
      duration: 4000,
      panelClass: ['success-snackbar'],
    });
  }
}