import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, of, tap } from 'rxjs';
import { cartItems, CartProducts } from '../models';
import { environment } from 'src/environments/environment';
import { ProductController } from './productController.service';
import { AuthorizeService } from './authorize.service';
import { UserInteractionService } from './user-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class CartController {

  apiBaseUrl = environment.apiBaseUrl;

  private addToCart = new BehaviorSubject<cartItems>({} as cartItems);
  private cartProducts = new BehaviorSubject<CartProducts[]>([]);

  _AddCartItems = this.addToCart.asObservable();
  _CartProducts = this.cartProducts.asObservable();

  private role = this.authorise.userAuthority;

  constructor(private http: HttpClient, private authorise: AuthorizeService, private notification: UserInteractionService) { }


  pushCartItem(items: cartItems) {
    console.info(`[${this.role}]: Adding Items to Cart.`)
    this.notification.showLoader();
    this.cartController.updateCartWithItem(items).pipe(tap(response => {
      this.notification.sppInfo(response);
      console.info(`[${this.role}]: Item added to Cart Successful.`)
    }), catchError(error => {
      this.notification.sppError('❌ ' + error.error);
      console.error('[cart] Failed to add product!');
      return of(false);
    }), finalize(() => this.notification.hideLoader())
    ).subscribe();
  }

  removeCartItem(Id: number) { }

  fetchCartItems() {
    this.notification.showLoader();
    this.cartController.getCart().pipe(tap((inCartItems: CartProducts[]) => {
      this.productToCart = inCartItems;
    }), catchError(error => {
      this.notification.sppError('❌ ' + error.error);
      console.error('[cart] Failed to add product!');
      return of(false);

    }), finalize(() => this.notification.hideLoader())).subscribe()
  }

  set productToCart(items: CartProducts[]) {
    this.cartProducts.next(items);
  }

  get productsInCart(){
    return this._CartProducts;
  }

  //sevt to cart
  set cartItem(item: cartItems) {
    this.addToCart.next(item);
    this.pushCartItem(item);
  }

  get cartItems() {
    return of([]);
  }


  //cartController
  cartController = {
    getCart: (): Observable<CartProducts[]> => this.http.get<CartProducts[]>(this.apiBaseUrl + 'cart', { responseType: 'json' }),
    updateCartWithItem: (cartItems: cartItems | cartItems[]): Observable<string> => this.http.post<string>(this.apiBaseUrl + 'cart/add', cartItems),
    deleteCart: (Id: number): Observable<string> => this.http.delete<string>(this.apiBaseUrl + `cart/remove/${Id}`)
  }

}
