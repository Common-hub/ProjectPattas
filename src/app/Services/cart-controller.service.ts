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
  private onlyQty = new BehaviorSubject<number[]>([]);

  _AddCartItems = this.addToCart.asObservable();
  _CartProducts = this.cartProducts.asObservable();
  _OnlyQty = this.onlyQty.asObservable();

  private role = this.authorise.getUserRole();
  constructor(private http: HttpClient, private cartItemOp: ProductController, private authorise: AuthorizeService, private notification: UserInteractionService) { }


  pushCartItem(items: cartItems) {
    console.info(`[${this.role}]: Adding Items to Cart.`)
    this.notification.showLoader();
    this.cartController.updateCartWithItem(items).pipe(tap(response => {
      this.notification.jobDone(response);
      console.info(`[${this.role}]: Item added to Cart Successful.`)
    }), catchError(error => {
      this.notification.jobError('❌ ' + error.error);
      console.error('[cart] Failed to add product!');
      return of(false);
    }), finalize(()=>this.notification.hideLoader())
    ).subscribe();
  }

  removeCartItem(Id: number) { }

  fetchCartItems() {
    
    this.cartController.getCart().pipe(tap((inCartItems: CartProducts[]) => {

    }))
  }

  //sevt to cart
  setAddCartItem(item: cartItems) {
    this.addToCart.next(item);
    this.pushCartItem(item);
  }

  setCartItems(iItems: CartProducts[]) {
    this.cartProducts.next(iItems)
    const qty: number[] = iItems.map(item=>{return item.orderedQuantity});
    this.setOnlyQty(qty)
  }

  setOnlyQty(qty:number[]){
    this.onlyQty.next(qty);
  }

  getOnlyQty(): number[]{
    return this.onlyQty.value;
  }

  //cartController
  cartController = {
    getCart: (): Observable<CartProducts[]> => this.http.get<CartProducts[]>(this.apiBaseUrl + 'cart', { responseType: 'json' }),
    updateCartWithItem: (cartItems: cartItems | cartItems[]): Observable<string> => this.http.post<string>(this.apiBaseUrl + 'cart/add', cartItems),
    deleteCart: (Id: number): Observable<string> => this.http.delete<string>(this.apiBaseUrl + `cart/remove/${Id}`)
  }

}
