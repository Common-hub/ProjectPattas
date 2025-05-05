import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userRegisration } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiInteractionService {
  url: string = "http://localhost:8080/api/auth/"

  constructor(private http: HttpClient) { }

  userRegistration(details:userRegisration): Observable<any>{ 
    return this.http.post(this.url +'register',  details, { responseType: 'text' })
  }
  
  verifyOtp(details:any): Observable<any>{    
    return this.http.post(this.url +'verify-otp',details, { responseType: 'text' })
  }

  loguser(details:any): Observable<any>{
    return this.http.post(this.url+'login', details, { responseType: 'text' });
  }
}
