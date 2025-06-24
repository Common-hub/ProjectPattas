import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credentials, Order, otpVerification, Product, userDetails, userRegistration } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {
  header = new HttpHeaders();
  // url: string = "https://project-pattasu.onrender.com/api/";
  url: string = "http://localhost:8080/api/";
  // url: string = "http://192.168.29.76:8080/api/";

  constructor(private http: HttpClient) { }

  userRegistration(details: userRegistration): Observable<any> {
    return this.http.post(this.url + 'auth/register', details, { responseType: 'text' })
  }

  verifyOtp(details: any): Observable<any> {
    return this.http.post(this.url + 'auth/verify-otp', details, { responseType: 'text' })
  }

  loguser(details: any): Observable<any> {
    return this.http.post(this.url + 'auth/login', details, { responseType: 'text' });
  }

  getUser(): Observable<any> {
    return this.http.get(this.url + 'auth/user', { responseType: 'json' })
  }

  // productAPI's

  getProducts(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `products?page=${page}&size=${size}`, { responseType: 'json' });
  }

  addproducts(product: FormData) {
    return this.http.post(this.url + 'products', product, { responseType: 'text' })
  }

  putProducts(id: number, product: Product): Observable<any> {
    return this.http.put(this.url + `products/${id}`, product, { responseType: 'text' })
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
    login: (credentials: Credentials): Observable<any> => this.http.post<any>(this.url + 'auth/login', credentials, { responseType: 'json' }),
    register: (userDetails: userRegistration): Observable<any> => this.http.post(this.url + 'auth/verify-otp', userDetails, { responseType: 'text' }),
    otpVerification: (payload: otpVerification): Observable<any> => this.http.post(this.url + 'auth/verify-otp', payload, { responseType: 'text' }),
    UserDetails: (): Observable<userDetails> => this.http.get<userDetails>(this.url + 'auth/user', { responseType: 'json' })
  }
}