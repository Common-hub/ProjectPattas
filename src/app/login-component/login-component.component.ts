import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpVerification, userRegisration } from '../models/user';
import { ApiInteractionService } from '../Services/api-interaction.service';

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
  EmailVerify: boolean = false
  head: string = "Login";
  response: string = "";

  constructor(private formBuilder: FormBuilder, private api: ApiInteractionService) { }

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]]
    });
    this.sign = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      OTP: ['',[Validators.minLength(6)]],
      mobile: ['',[Validators.required, Validators.maxLength(10)]],
      password: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      cPassword: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
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

  register(){
    console.log("hi");
    
    if( this.passwordMatchValidator() ){      
    let registration: userRegisration = {
      name: this.sign.controls['name'].value,
      email: this.sign.controls['email'].value,
      phoneNumber: ''+this.sign.controls['mobile'].value,
      password: this.sign.controls['password'].value
    }
    this.api.userRegistration(registration).subscribe(resp=>{
      this.EmailVerify = true;
      this.response = resp;
      console.log(resp);      
    })
    }
  }
  verify(){
    let Otp: OtpVerification = {
      email: this.sign.controls['email'].value,
      otp: this.sign.controls['OTP'].value
    }
    this.api.verifyOtp(Otp).subscribe(resp =>{
      console.log(resp)
    })
  }

  passwordMatchValidator() {
    const password =this.sign.controls['password'].value;
    const confirmPassword = this.sign.controls['cPassword'].value;

    return password !== confirmPassword  ? false : true;
  }

}
