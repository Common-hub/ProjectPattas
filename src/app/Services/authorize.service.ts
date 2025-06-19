import { Injectable } from '@angular/core';
import { SearchService } from './search.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  private jwtToken = '';
  private _Token = '';
  private inactivityLimit = 15 * 60 * 1000; // 15 minutes inactivity limit
  private lastActivity = Date.now();

  isAlerted: boolean = false;


  constructor(private alert: SearchService, private router: Router) {
   if(this._Token !== '') console.log('[Log] setting JWT Token .....');
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

  private async activityMonitor() {
    var responed: boolean = false;
    if (!this.isAlerted) {
      this.isAlerted = true;
      const timeout = new Promise<boolean>(res => setTimeout(() => res(false), 60 * 1000));
      const confirmed = await Promise.race([this.alert.open('Session'), timeout]);
      if (confirmed) {
        console.info("[Gaurd]: user retained session.")
        responed = true;
      } else {
        console.info("[Gaurd]: user has been logged out.")
        this.alert.jobError('👋 No response or declined. Logging out.');
        sessionStorage.clear();
        console.info("[Guard]: Deleted all items form session.")
        this.alert.isVisible(false);
        this.router.navigate(['/login']);
      };
    }
  }

  setToken(token: string) {
    this.jwtToken = token;
    sessionStorage.setItem('token', token);
  }

  getToken(): string {
    if (!this._Token) {
      const sessionToken = sessionStorage.getItem("token");
      if (sessionToken) this._Token = sessionToken;
    }
    return this._Token;
  }

  reStoreFromSession() {
    const token = this.getToken()
    if (token !== '') {
      console.info('[Guard]: Token restored from session Succesfull!');
      this.setToken(token);
    } else {
      console.info('[Guard]: Failed token restoration.Login!');
    }
  }

  clear() {
    this._Token = '';
    sessionStorage.removeItem('token');
    console.info(`[${this.getUserRole()}]: Deleted all items form session.`)
    console.info(`[${this.getUserRole()}]: Deleted all items form session.`)
  }

  getUserRole(): string {
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
      this.alert.jobError("Error getting the Permission.")
    }
  }

}
