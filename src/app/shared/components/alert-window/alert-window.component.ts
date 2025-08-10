import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizeService } from 'src/app/core/guard/authorize.service';
import { alertType, Notification, UserInteractionService } from 'src/app/core/service/user-interaction.service';

@Component({
  selector: 'alert',
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.css']
})
export class AlertWindowComponent implements OnInit {

  userRole: string = '';

  toastMessage!: Notification

  isAlert: boolean = false;
  alert!: alertType;

  countdown: number = 60;
  countdownDisplay: string = '';
  interval: any;

  constructor(private informerClass: UserInteractionService, private authuntication: AuthorizeService, private router: Router) { }

  ngOnInit() {

    this.userRole = this.authuntication.userAuthority;



    this.informerClass._PopUpData.subscribe(data => {
      if (data) {
        this.toastMessage = data;
      }
      else {
        this.toastMessage = { message: '', type: 'success' };
      }
    })

    //alert
    this.informerClass._AlertType.subscribe(data => {
      if (data === 'confirmLogout') {
        if (this.authuntication.isUserLoggedIn) {
          this.alert = data;
          this.windowLifeTime();
        }
      } else if (data === 'session') {
        if (this.authuntication.isUserLoggedIn) {
          this.alert = data;
          this.windowLifeTime();
        }
      } else if (data === 'confirmLogin') {
        this.alert = data;
        this.windowLifeTime();
      } else if (data === 'confirm') {
        if (this.authuntication.isUserLoggedIn) {
          this.alert = data;
          this.windowLifeTime();
        }
      }
    });
    this.informerClass.promptAlert.subscribe(show => this.isAlert = show);

  }

  private windowLifeTime() {
    setInterval(() => {
      const min = Math.floor(this.countdown / 60);
      const sec = this.countdown % 60;
      this.countdownDisplay = `${min}:${sec < 10 ? '0' + sec : sec}`;
      if (--this.countdown < 0) {
        clearInterval(this.interval);
      }
    }, 1000)
  }

  onSave() {
    this.informerClass.userResponseGetter(true);
  }
  onCancel() {
    this.informerClass.userResponseGetter(false);
  }

  onLogout() {
    if (this.userRole === 'admin') {
      this.router.navigate(['login'])
    } else {
      this.router.navigate(['user/productsList']);
      if (this.router.url === '/user/productsList') {
        window.location.reload()
      }
    }
    this.authuntication.clear();
    this.informerClass.sppInfo('Saved used DATA !.');
    this.informerClass.sppInfo('Redirected to Default !.');
    this.authuntication.allowedRoutes()
    this.informerClass.userResponseGetter(true);
  }

  onLogin() {
    this.informerClass.sppInfo('Redirected to Login !.');
    this.router.navigate(['login']);

    this.informerClass.userResponseGetter(true);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval)
  }
}
