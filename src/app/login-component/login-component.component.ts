import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  login!: FormGroup
  sign!: FormGroup
  LoginBool: boolean = true;
  signUpBool: boolean = false;
  changeBool: boolean = false;
  head: string = "Login";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]]
    });
    this.sign = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      mobile: ['',[Validators.required, Validators.maxLength(10)]],
      password: ['',[Validators.required, Validators.minLength(8)]],
      cPassword: ['',[Validators.required, Validators.minLength(8)]]
    });

  }

  changeForm(hint: string) {
    switch (hint) {
      case "L":
        this.head = "Login USER"
        this.LoginBool = true;
        this.signUpBool = false;
        this.changeBool = false;
        break;
      case "S":
        this.head = "New User Registration"
        this.signUpBool = true;
        this.LoginBool = false;
        this.changeBool = false;
        break;
      case "F":
        this.head = "Forget Password"
        this.signUpBool = false;
        this.LoginBool = false;
        this.changeBool = true;
        break;
      default:
        break;
    }
  }

  validate(){
    return 0
  }
}
