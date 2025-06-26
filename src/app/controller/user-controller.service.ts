import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Credentials, Order, otpVerification, userDetails, userRegistration } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {

  apiBaseUrl = environment.apiBaseUrl + 'auth/'
  url: string = "http://localhost:8080/api/";

  constructor(private http: HttpClient) { }

  userRegistration(details: userRegistration): Observable<any> {
    return this.http.post(this.url + 'register', details, { responseType: 'text' })
  }

  verifyOtp(details: any): Observable<any> {
    return this.http.post(this.url + 'verify-otp', details, { responseType: 'text' })
  }

  loguser(details: any): Observable<any> {
    return this.http.post(this.url + 'login', details, { responseType: 'text' });
  }

  getUser(): Observable<any> {
    return this.http.get(this.url + 'user', { responseType: 'json' })
  }

  //CartAPI's

  addCart(cartitems: any): Observable<any> {
    return this.http.post(this.url + 'cart/add', cartitems, { responseType: 'text' })
  }

  getCart(): Observable<any> {
    return this.http.get(this.url + 'cart', { responseType: 'json' })
  }

  deleteCart(pId: number): Observable<any> {
    return this.http.delete(this.url + 'cart/remove/' + pId, { responseType: 'text' })
  }

  //OrderAPI's

  getOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url + 'order', { responseType: 'json' })
  }
  getInvoice(orderId: number): Observable<any> {
    return this.http.get(this.url + `order/${orderId}/invoice`, { responseType: 'blob' })
  }
  postOrder(address: any): Observable<any> {
    return this.http.post(this.url + `order/place?address=${JSON.stringify(address).toString()}`, { responseType: 'text' })
  }

  userController = {
    login: (credentials: Credentials): Observable<any> => this.http.post<any>(this.apiBaseUrl + 'login', credentials, { responseType: 'json' }),
    register: (userDetails: userRegistration): Observable<any> => this.http.post(this.apiBaseUrl + 'verify-otp', userDetails, { responseType: 'text' }),
    otpVerification: (payload: otpVerification): Observable<any> => this.http.post(this.apiBaseUrl + 'verify-otp', payload, { responseType: 'text' }),
    UserDetails: (): Observable<userDetails> => this.http.get<userDetails>(this.apiBaseUrl + 'user', { responseType: 'json' })
  }
}