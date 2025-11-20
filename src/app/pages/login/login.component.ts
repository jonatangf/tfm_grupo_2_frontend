import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None, //FormGroup de angular trae estilo por encasulapcion (quitamos)
})
export class LoginComponent {
  @Input() register!: boolean;
  @Output() submitted = new EventEmitter<any>();
  userForm!: FormGroup;

  constructor() {
    this.userForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  submitUser() {
    if (this.userForm.valid) {
      console.log('submitted!');
      this.submitted.emit(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return (
      this.userForm.get(controlName)?.hasError(errorName) && this.userForm.get(controlName)?.touched
    );
  }
}
