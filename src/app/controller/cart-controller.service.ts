import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorizeService } from '../core/guard/authorize.service';
import { UserInteractionService } from '../core/service/user-interaction.service';
import { cartItems, inCart } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartController {

  apiBaseUrl = environment.apiBaseUrl;

  private cartItem = new BehaviorSubject<cartItems>({} as cartItems);
  private cartProducts = new BehaviorSubject<inCart[]>([]);

  $CartItems = this.cartItem.asObservable();
  $cartProducts = this.cartProducts.asObservable();

  constructor(private http: HttpClient, private authorise: AuthorizeService, private notification: UserInteractionService) { }


  addToCart(cartItem: cartItems) {
    console.info("[Guard]: item getting aded to Cart.")
    this.cartController.updateCartWithItem(cartItem).pipe(tap(response => {
      this.notification.sppInfo(response);
      this.fetchCart();
      console.info("[Guard] item added succesful .")
    }),
      catchError(error => {
        this.notification.sppError('❌ ' + error.error);

        console.error('[Products] productFetch Failed!....');
        return of([]);
      }),
      finalize(() => this.notification.hideLoader())).subscribe();
  }

  fetchCart() {
    console.info("[Gaurd]: Getting the items in buffer.");
    this.cartController.getCart().pipe(tap(response => {
      this.inCart = response;
      console.info("[Guard]: Retiving cart Succesful.")
    }),
      catchError(error => {
        this.notification.sppError('❌ ' + error.error);
        console.error('[Products] productFetch Failed!....');
        return of([]);
      }),
      finalize(() => this.notification.hideLoader())).subscribe();
  }

  removeCartItem(id: number) {
    this.cartController.deleteCart(id).pipe(tap(response => {
      this.notification.sppWarning(response);
      this.fetchCart();
    }),
      catchError(error => {
        this.notification.sppError('❌ ' + error.error);
        console.error('[Products] productFetch Failed!....');
        return of([]);
      }),
      finalize(() => this.notification.hideLoader())).subscribe();
  }

  set addCartItem(item: cartItems) {
    this.cartItem.next(item);
    console.log(item)
    this.addToCart(this.cartItem.value);
  }

  get $addCartitem(): Observable<cartItems> {
    return this.$CartItems;
  }

  set inCart(inCart: inCart[]) {
    this.cartProducts.next(inCart);
  }

  get $inCart(): Observable<inCart[]> {
    return this.$cartProducts;
  }
  //cartController
  cartController = {
    getCart: (): Observable<inCart[]> => this.http.get<inCart[]>(this.apiBaseUrl + 'cart', { responseType: 'json' }),
    updateCartWithItem: (cartItems: cartItems | cartItems[]): Observable<string> => this.http.post<string>(this.apiBaseUrl + 'cart/add', cartItems),
    deleteCart: (Id: number): Observable<string> => this.http.delete<string>(this.apiBaseUrl + `cart/remove/${Id}`)
  }

}
