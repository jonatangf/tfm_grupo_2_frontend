import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, // Asumo standalone como antes
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None, //FormGroup de angular trae estilo por encasulapcion (quitamos)
})
export class LoginComponent implements OnInit {
  @Input() register!: boolean;
  @Output() submitted = new EventEmitter<any>();
  userForm!: FormGroup;

  ngOnInit() {
    this.userForm = new FormGroup({
      username: new FormControl('', this.register ? [Validators.required, Validators.minLength(3)] : []),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submitUser() {
    if (this.userForm.valid) {
      console.log('Formulario válido, enviando...');
      this.submitted.emit(this.userForm.value);
    } else {
      console.log('Formulario no válido, marcando campos...');
      this.userForm.markAllAsTouched();
    }
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    // Usamos el operador 'safe navigation' (?) para evitar errores si el control aún no existe
    const control = this.userForm.get(controlName);
    return control?.hasError(errorName) && control?.touched;
  }
}