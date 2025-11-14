import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None  //FormGroup de angular trae estilo por encasulapcion (quitamos)
})
export class LoginComponent {
@Input() register! : boolean;
@Output() submitted = new EventEmitter<any>();
userForm! : FormGroup;

constructor(){
  this.userForm = new FormGroup({
    username: new FormControl(""),
    email: new FormControl("",[
      Validators.required,
      Validators.pattern(/\S+\@\S+\.\S+/)
    ]),
    password: new FormControl("",[
      Validators.required,
    ])
  });
}

  ngOnInit() {
    // Condicionalidad de validadores según register
    if (this.register) {
      this.userForm.get('username')?.setValidators([Validators.required]);
    } else {
      this.userForm.get('username')?.clearValidators();
    }
    this.userForm.get('username')?.updateValueAndValidity(); //Actualiza las propiedades internas: valid, invalid, errors, status
  }

  submitUser() {
    if (this.userForm.valid) {
      console.log('submitted!')
      this.submitted.emit(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

   checkControl(controlName:string, errorName:string) : boolean  | undefined {
    return this.userForm.get(controlName)?.hasError(errorName) 
            && this.userForm.get(controlName)?.touched
  }

}
