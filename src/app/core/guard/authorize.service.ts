import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInteractionService } from '../service/user-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private jwtToken = '';
  private _Token = '';
  private inactivityLimit = 15 * 60 * 1000; // 15 minutes inactivity limit
  private lastActivity = Date.now();

  isAlerted: boolean = false;


  constructor(private alert: UserInteractionService, private router: Router) {
    if (this._Token !== '') console.log('[Log] setting JWT Token .....');
  }

  setupActivityListeners() {
    ['click', 'mousemove', 'keydown', 'touchstart'].forEach(evt => {
      console.info("[Gaurd]: Found no activity.");
      window.addEventListener(evt, () => {
        this.lastActivity = Date.now();
        if (this.isAlerted) this.isAlerted = false; // reset alert if user is back
      })
    });
  }

  checkActivity() {
    console.info("[guard]: Activity Checker.");
    const inactiveTime = Date.now() - this.lastActivity;
    if (inactiveTime > this.inactivityLimit) {
      console.info("[Gaurd]: Found no activity.")
      this.activityMonitor();
    }
  }

  get isUserLoggedIn() {
    return this.userIdentifier !== '' ? true : false;
  }

  private async activityMonitor() {
    var responed: boolean = false;
    if (!this.isAlerted) {
      this.isAlerted = true;
      const timeout = new Promise<boolean>(res => setTimeout(() => res(false), 60 * 1000));
      const confirmed = await Promise.race([this.alert.openWindow('session'), timeout]);
      if (confirmed) {
        console.info("[Gaurd]: user retained session.")
        responed = true;
      } else {
        console.info("[Gaurd]: user has been logged out.")
        this.alert.sppError('👋 No response or declined. Logging out.');
        sessionStorage.clear();
        console.info("[Guard]: Deleted all items form session.")
        this.alert.isVisible(false);
        this.router.navigate(['/login']);
      };
    }
  }

  set authToken(token: string) {
    this.jwtToken = token;
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

  allowedRoutes(): { route: string; key: string; }[] {

    if (this.userAuthority === 'admin') {
      return [
        { route: 'admin/dashBoard', key: `<span class="bi bi-speedometer2"></span>&nbsp; <label class="d-none d-md-inline"> DashBoard</label>` },
        { route: 'admin/addProducts', key: `<span class="bi bi-cart-plus"></span>&nbsp; <label class="d-none d-md-inline"> Inventory</label>` },
        { route: 'admin/productsList', key: `<span class="bi bi-view-list"></span>&nbsp; <label class="d-none d-md-inline"> ProductList</label>` }]
    } else if (this.userAuthority === 'user') {
      return [
        { route: 'user/productsList', key: `<span class="bi bi-houses"></span>&nbsp; <label class="d-none d-md-inline"> Home</label>` },
        { route: 'user/viewCart', key: `<span class="bi bi-cart3"></span>&nbsp; <label class="d-none d-md-inline">  View Cart</label>` },
        { route: 'user/orderStatus', key: `<span class="bi bi-bag-check-fill"></span>&nbsp; <label class="d-none d-md-inline"> Orders</label>` }
      ]
    }
    return []
  }
}
