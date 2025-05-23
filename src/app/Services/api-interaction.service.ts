import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userRegisration } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiInteractionService {
  header = new HttpHeaders();
  url: string = "http://localhost:8080/"

  constructor(private http: HttpClient) { }

  userRegistration(details:userRegisration): Observable<any>{ 
    return this.http.post(this.url +'api/auth/register',  details, { responseType: 'text' })
  }
  
  verifyOtp(details:any): Observable<any>{    
    return this.http.post(this.url +'api/auth/verify-otp',details, { responseType: 'text' })
  }

  loguser(details:any): Observable<any>{
    return this.http.post(this.url+'api/auth/login', details, { responseType: 'text' });
  }

  getProducts(): Observable<any>{
    return this.http.get(this.url + 'products?page=0&size=10', { responseType: 'json' });
  }

  addCart(cartitems:any): Observable<any>{
    return this.http.post(this.url + 'cart/add', cartitems, {responseType: 'text'})
  }
}
