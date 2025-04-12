import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  login!: FormGroup
  LoginBool: boolean = true;
  signUpBool: boolean = false;
  changeBool: boolean = false;
  head: string = "Login";

  constructor() { }

  ngOnInit(): void {
  }

  changeForm(hint: string) {
    if(hint === 'S'){
      this.head = "SignUp";
      this.signUpBool = true;
      this.LoginBool = false;
      this.changeBool = false;
    }
    else if(hint === 'F'){
      this.head = "Change Password";
      this.signUpBool = false;
      this.LoginBool = false;
      this.changeBool = true
    }else{
        this.head = "Login";
        this.signUpBool = false;
        this.LoginBool = true;
        this.changeBool = false;
      }
  }
}
