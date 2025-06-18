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


  constructor(private alert: SearchService, private router: Router) { }

  setupActivityListeners() {
    ['click', 'mousemove', 'keydown', 'touchstart'].forEach(evt =>
      window.addEventListener(evt, () => {
        this.lastActivity = Date.now();
        if (this.isAlerted) this.isAlerted = false; // reset alert if user is back
      })
    );
  }

  checkActivity() {
    console.log("checking///....");
    const inactiveTime = Date.now() - this.lastActivity;
    if (inactiveTime > this.inactivityLimit) {
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
        responed = true;
      } else {
        this.alert.jobError('👋 No response or declined. Logging out.');
        sessionStorage.clear();
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

  clear() {
    this._Token = '';
    sessionStorage.removeItem('token')
  }

  getrole(): string {
    if (this.jwtToken !== '')
      return this.tokenDecoder(this.jwtToken).role;
    return '';
  }

  //decode token
  private tokenDecoder(token: string) {
    if (token !== '') {
      try {
        const payloadData = token.split('.')[1];
        return JSON.parse(atob(payloadData.replace(/-/g, '+').replace(/_/g, '/')));
      }
      catch (e) {
        return null;
      }
    } else {
      this.alert.jobError("Error getting the Permission.")
    }
  }

}
