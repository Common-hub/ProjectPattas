import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userRegisration } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiInteractionService {
  header = new HttpHeaders();
  // url: string = "https://lp-patents-installations-apt.trycloudflare.com/api/";
  // url: string = "http://localhost:8080/"
  url: string = "http://192.168.29.76:8080/"

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

  getProducts(page: number, size: number): Observable<any>{
    return this.http.get(this.url + `products?page=${page}&size=${size}`, { responseType: 'json' });
  }

  addCart(cartitems:any): Observable<any>{
    return this.http.post(this.url + 'cart/add', cartitems, {responseType: 'text'})
  }

  getCart(): Observable<any>
  {
    return this.http.get(this.url + 'cart', {responseType: 'json'})
  }

  deleteCart(pId: number): Observable<any>{
    return this.http.delete(this.url + 'cart/remove/'+ pId, {responseType: 'text'})
  }
}
