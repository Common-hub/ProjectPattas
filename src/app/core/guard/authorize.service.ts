import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserInteractionService } from '../service/user-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private jwtToken = '';
  private _Token = '';
  private routerArr = new BehaviorSubject<any[]>([])

  isAlerted: boolean = false;

  _routerArr = this.routerArr.asObservable()


  constructor(private alert: UserInteractionService, private router: Router) {
    // No inactivity logic needed
  }

  get isUserLoggedIn() {
    return this.userIdentifier !== '' ? true : false;
  }

  set authToken(token: string) {
    this.jwtToken = token;
    this._Token = token;
    sessionStorage.setItem('token', token);
  }

  get userIdentifier(): string {
    if (!this._Token) {
      const sessionToken = sessionStorage.getItem("token");
      if (sessionToken) this._Token = sessionToken;
    }
    return this._Token;
  }

  reStoreFromSession() {
    const sessionToken = sessionStorage.getItem("token");
    if (sessionToken) {
      this.jwtToken = sessionToken;
      this._Token = sessionToken;
      console.info('[Guard]: Token restored from session successfully!');
    } else {
      console.info('[Guard]: Failed token restoration. Login required!');
    }
  }

  clear() {
    this._Token = '';
    sessionStorage.removeItem('token');
    this.routerArr.next([]);
    console.info(`[${this.userAuthority}]: Deleted all items form session.`)
    console.info(`[${this.userAuthority}]: Deleted all items form session.`)
  }

  get userAuthority(): string {
    if (this.jwtToken !== '')
      return this.tokenDecoder(this.jwtToken).role;
    return '';
  }

  //decode token
  private tokenDecoder(token: string) {
    console.info("[Guard]: Getting user Info.");
    if (token !== '') {
      try {
        const payloadData = token.split('.')[1];
        console.info("[Guard]: user Information successful.")
        return JSON.parse(atob(payloadData.replace(/-/g, '+').replace(/_/g, '/')));
      }
      catch (e) {
        console.info("[Guard]: Error getting user Info.")
        return null;
      }
    } else {
      this.alert.sppError("Error getting the Permission.")
    }
  }

  allowedRoutes(): void {
    let routes: { route: string; key: string; }[] = [];
    if (this.userAuthority === 'admin') {
      routes = [
        { route: 'admin/dashBoard', key: `<span class="bi bi-speedometer2"></span>&nbsp; <label class="d-none d-md-inline"> DashBoard</label>` },
        { route: 'admin/addProducts', key: `<span class="bi bi-cart-plus"></span>&nbsp; <label class="d-none d-md-inline"> Inventory</label>` },
        { route: 'admin/productsList', key: `<span class="bi bi-view-list"></span>&nbsp; <label class="d-none d-md-inline"> ProductList</label>` }
      ];
    } else if (this.userAuthority === 'user') {
      routes = [
        { route: 'user/productsList', key: `<span class="bi bi-houses"></span>&nbsp; <label class="d-none d-md-inline"> Home</label>` },
        { route: 'user/viewCart', key: `<span class="bi bi-cart3"></span>&nbsp; <label class="d-none d-md-inline">  View Cart</label>` },
        { route: 'user/orderStatus', key: `<span class="bi bi-bag-check"></span>&nbsp; <label class="d-none d-md-inline"> Orders</label>` }
      ];
    } else {
      routes = [];
    }
    this.routerArr.next(routes);
  }


  get routes() {
    this.allowedRoutes();
    return this.routerArr
  }
}
