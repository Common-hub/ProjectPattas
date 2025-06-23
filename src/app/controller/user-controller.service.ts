import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credentials, otpVerification, userDetails, userRegistration } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {
  header = new HttpHeaders();
  // url: string = "https://project-pattasu.onrender.com/api/";
  url: string = "http://localhost:8080/api/";
  // url: string = "http://192.168.29.76:8080/api/";

  constructor(private http: HttpClient) { }

  private userController = {
    login: (credentials: Credentials): Observable<any> => this.http.post<any>(this.url + 'auth/login', credentials, { responseType: 'json' }),
    register: (userDetails: userRegistration): Observable<any> => this.http.post(this.url + 'auth/verify-otp', userDetails, { responseType: 'text' }),
    otpVerification: (payload: otpVerification): Observable<any> => this.http.post(this.url + 'auth/verify-otp', payload, { responseType: 'text' }),
    UserDetails: (): Observable<userDetails> => this.http.get<userDetails>(this.url + 'auth/user', { responseType: 'json' })
  }
}