import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpVerification, userRegisration } from '../../models/user';
import { ApiInteractionService } from '../../Services/api-interaction.service';
import { Router } from '@angular/router';

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
  EmailVerify: boolean = false;
  canResend: boolean = false;
  head: string = "Login";
  response: string = "";
  errorMsg: string = "";
  type: string = "";
  minutes: number = 3;
  seconds: number = 0;
  private interval: any;

  constructor(private formBuilder: FormBuilder, private api: ApiInteractionService, private route:Router) { }

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.sign = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      OTP: ['', [Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      cPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });

  }

  changeForm(hint: string): void {
    const formConfig: {[key: string]: any}= {
        L: { head: "Login USER", resetForm: () => this.login.reset(), login: true, signUp: false, change: false },
        S: { head: "New User Registration", resetForm: () => this.sign.reset(), login: false, signUp: true, change: false },
        F: { head: "Forget Password", resetForm: () => {}, login: false, signUp: false, change: true }
    };

    const config = formConfig[hint];
    if (config) {
        this.head = config.head;
        config.resetForm();
        this.LoginBool = config.login;
        this.signUpBool = config.signUp;
        this.changeBool = config.change;
    }
}


  // isNumber(event: KeyboardEvent) {
  //   const char = String.fromCharCode(event.keyCode);
  //   if (!/^[0-9]*$/.test(char)) {
  //     event.preventDefault();
  //   }
  // }

   startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.interval);
          this.canResend = true;
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  register() {
    if (this.passwordMatchValidator()) {
      let registration: userRegisration = {
        name: this.sign.controls['name'].value,
        email: this.sign.controls['email'].value,
        phoneNumber: '' + this.sign.controls['mobile'].value,
        password: this.sign.controls['password'].value
      }
      this.api.userRegistration(registration).subscribe(resp => {
        this.EmailVerify = true;
        this.errorMsg = resp;
        this.type = 'success';
        this.startTimer();
      },
        (error) => {
          this.errorMsg = error.error;
          this.type = 'error';
        }
      )
    }
  }

  resendOtp() {
    this.resetTimer();
  }

  resetTimer() {
    clearInterval(this.interval);
    this.minutes = 3;
    this.seconds = 0;
    this.canResend = false;
    this.startTimer();
  }

  verify() {
    let Otp: OtpVerification = {
      email: this.sign.controls['email'].value,
      otp: this.sign.controls['OTP'].value.toString()
    }
    this.api.verifyOtp(Otp).subscribe(resp => {
      this.LoginBool = true;
      this.signUpBool = false;
      this.changeForm('L')
      this.EmailVerify = false;
      this.errorMsg = resp;
      this.type = "success";
    },
  (error)=>{
    this.errorMsg = error.error;
    this.type = "error";
  })
  }

  passwordMatchValidator() {
    const password = this.sign.controls['password'].value;
    const confirmPassword = this.sign.controls['cPassword'].value;

    return password !== confirmPassword ? false : true;
  }
  
  loguser(){
    let login = {
        email: this.login.controls['userName'].value,
        password: this.login.controls['password'].value
    }
    this.api.loguser(login).subscribe(res=>{
      const response = JSON.parse(res);
      sessionStorage.setItem('token',response.token)
      response.role === 'admin' ? this.route.navigate(['/addProducts']) : this.route.navigate(['/productsList']);            
    },
    (error)=> {
      if(error.error !== '') {this.errorMsg = error.error; this.type="error"}
    }
  )}
}
