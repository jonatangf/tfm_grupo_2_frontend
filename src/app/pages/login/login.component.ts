import { Component, Input, ViewEncapsulation } from '@angular/core';
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
userForm! : FormGroup;

constructor(){
  this.userForm = new FormGroup({
    name: new FormControl("",[
      Validators.required,
    ]),
    email: new FormControl("",[
      Validators.required,
      Validators.pattern(/\S+\@\S+\.\S+/)
    ]),
    password: new FormControl("",[
      Validators.required,
    ])
  });
}

submitUser(){

}

}
