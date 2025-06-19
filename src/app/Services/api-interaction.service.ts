import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cartItems, CartProducts, Credentials, NewProduct, Order, otpVerification, Product, userDetails, userRegistration } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiInteractionService {
  header = new HttpHeaders();
  // url: string = "https://project-pattasu.onrender.com/api/";
  url: string = "http://localhost:8080/api/";
  // url: string = "http://192.168.29.76:8080/api/";

  constructor(private http: HttpClient) { }

  userController = {
    login: (credentials: Credentials): Observable<any> => this.http.post<any>(this.url + 'auth/login', credentials, { responseType: 'json' }),
    register: (userDetails: userRegistration): Observable<any> => this.http.post(this.url + 'auth/verify-otp', userDetails, { responseType: 'text' }),
    otpVerification: (payload: otpVerification): Observable<any> => this.http.post(this.url + 'auth/verify-otp', payload, { responseType: 'text' }),
    UserDetails: (): Observable<userDetails> => this.http.get<userDetails>(this.url + 'auth/user', { responseType: 'json' })
  }

  productController = {
    getProducts: (page: number, size: number): Observable<Product[]> => this.http.get<Product[]>(this.url + `products?page=${page}&size=${size}`, { responseType: 'json' }),
    postProduct: (product: FormData): Observable<Product> => this.http.post<Product>(this.url + 'products', product, { responseType: 'json' }),
    getProductById: (Id: number): Observable<Product> => this.http.get<Product>(this.url + `products/${Id}`, { responseType: 'json' }),
    putProductById: (Id: number, product: Product): Observable<Product> => this.http.put<Product>(this.url + `products/${Id}`, product, { responseType: 'json' }),
    deleteProductById: (Id: number): Observable<string> => this.http.delete(this.url + `products/${Id}`, { responseType: 'text' as const })
  }

  cartController = {
    getCart: (): Observable<CartProducts[]> => this.http.get<CartProducts[]>(this.url + 'cart', { responseType: 'json' }),
    postCart: (cartItems: cartItems | cartItems[]): Observable<string> => this.http.post<string>(this.url + 'cart/add', cartItems),
    deleteCart: (Id: number): Observable<string> => this.http.delete<string>(this.url + `cart/remove/${Id}`)
  }

  orderController = {
    placeOrder: (userAddress: string): Observable<Order[]> => this.http.post<Order[]>(this.url + 'order/place', userAddress, { responseType: 'json' }),
    getOrders: (): Observable<Order[]> => this.http.get<Order[]>(this.url + 'order', { responseType: 'json' }),
    downloadInvoice: (orderId: number): Observable<string[]> => this.http.get<string[]>(this.url + `order/${orderId}/invoice`),
  }
  // commonAPI's

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
}