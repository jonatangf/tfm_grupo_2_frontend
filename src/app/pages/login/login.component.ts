import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
@Input() register! : boolean;


/*Juan* 
 Guardar token en localStorage
 Recuperamos en /guards/login
*/

}
