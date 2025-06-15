import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { order, products, userRegisration } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ApiInteractionService {
  header = new HttpHeaders();
  // url: string = "https://project-pattasu.onrender.com/api/";
  url: string = "http://localhost:8080/api/";
  // url: string = "http://192.168.29.76:8080/api/";

  constructor(private http: HttpClient) { }

  userRegistration(details:userRegisration): Observable<any>{ 
    return this.http.post(this.url +'auth/register',  details, { responseType: 'text' })
  }
  
  verifyOtp(details:any): Observable<any>{    
    return this.http.post(this.url +'auth/verify-otp',details, { responseType: 'text' })
  }

  loguser(details:any): Observable<any>{
    return this.http.post(this.url+'auth/login', details, { responseType: 'text' });
  }

  addproducts(product: products| products[]){
    return this.http.post(this.url+ 'products', product, {responseType: 'text'})
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

  getOrder(): Observable<order[]>
  {
    return this.http.get<order[]>(this.url + 'order', {responseType: 'json'})
  }
  postOrder(address:any):Observable<any>{
    return this.http.post(this.url +`order/place?address=${JSON.stringify(address).toString()}`,{responseType: 'text'})
  }

  deleteCart(pId: number): Observable<any>{
    return this.http.delete(this.url + 'cart/remove/'+ pId, {responseType: 'text'})
  }
}