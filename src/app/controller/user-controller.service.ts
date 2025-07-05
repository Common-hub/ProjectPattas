import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInteractionService } from '../core/service/user-interaction.service';
import { Credentials, Order, otpVerification, userDetails, userRegistration } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class UserControllerService {

  apiBaseUrl = environment.apiBaseUrl + 'auth/'
  url: string = "http://localhost:8080/api/";


  private userData = new BehaviorSubject<userDetails>({} as userDetails);
  private isAddress = new BehaviorSubject<boolean>(false);

  $UserData = this.userData.asObservable();

  constructor(private http: HttpClient, private notification: UserInteractionService) { }

  userRegistration(details: userRegistration): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'register', details, { responseType: 'text' })
  }

  verifyOtp(details: any): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'verify-otp', details, { responseType: 'text' })
  }

  loguser(details: any): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'login', details, { responseType: 'text' });
  }

  getUser(): Observable<any> {
    return this.http.get(this.apiBaseUrl + 'user', { responseType: 'json' })
  }

  getUserData() {
    this.userController.UserDetails().pipe(tap(response => {
      if (response) {
        this.userDetail = response;
      }
    }), catchError(error => {
      this.notification.sppError('❌ ' + error.error);

      console.error('[Products] productFetch Failed!....');
      return of([]);
    })).subscribe();
  }

  //CartAPI's

  addCart(cartitems: any): Observable<any> {
    return this.http.post(this.apiBaseUrl + 'cart/add', cartitems, { responseType: 'text' })
  }

  getCart(): Observable<any> {
    return this.http.get(this.apiBaseUrl + 'cart', { responseType: 'json' })
  }

  deleteCart(pId: number): Observable<any> {
    return this.http.delete(this.apiBaseUrl + 'cart/remove/' + pId, { responseType: 'text' })
  }

  //OrderAPI's

  getOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiBaseUrl + 'order', { responseType: 'json' })
  }
  getInvoice(orderId: number): Observable<any> {
    return this.http.get(this.apiBaseUrl + `order/${orderId}/invoice`, { responseType: 'blob' })
  }
  postOrder(address: any): Observable<any> {
    return this.http.post(this.apiBaseUrl + `order/place?address=${JSON.stringify(address).toString()}`, { responseType: 'text' })
  }

  set userDetail(details: userDetails) {
    this.userData.next(details);
  }

  get $UserDetail(): Observable<userDetails> {
    return this.userData;
  }

  set addressFound(flag: boolean) {
    this.isAddress.next(flag);
  }

  get $addressFound(): boolean {
    return this.isAddress.value;
  }

  userController = {
    login: (credentials: Credentials): Observable<any> => this.http.post<any>(this.apiBaseUrl + 'login', credentials, { responseType: 'json' }),
    register: (userDetails: userRegistration): Observable<any> => this.http.post(this.apiBaseUrl + 'verify-otp', userDetails, { responseType: 'text' }),
    otpVerification: (payload: otpVerification): Observable<any> => this.http.post(this.apiBaseUrl + 'verify-otp', payload, { responseType: 'text' }),
    UserDetails: (): Observable<userDetails> => this.http.get<userDetails>(this.apiBaseUrl + 'user', { responseType: 'json' })
  }
}