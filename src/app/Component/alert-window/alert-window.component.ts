import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from 'src/app/Services/user-interaction.service';

@Component({
  selector: 'alert',
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.css']
})
export class AlertWindowComponent implements OnInit {

  message: string = '';
  alertType: string = 'success';

  isAlert: boolean = false;
  alert: string = '';

  countdown: number = 60;
  countdownDisplay: string = '';
  interval: any;
  constructor(private notification: UserInteractionService) { }

  ngOnInit() {
    this.notification.notification$.subscribe(data => {
      if (data) {
        this.message = data.message;
        this.alertType = data.type;
      }
      else {
        this.message = '';
      }
    })

    //alert
    this.notification.type$.subscribe(data => {
      this.alert = data
      if (this.alert === 'Session') {
        setInterval(() => {
          const min = Math.floor(this.countdown / 60);
          const sec = this.countdown % 60;
          this.countdownDisplay = `${min}:${sec < 10 ? '0' + sec : sec}`;
          if (--this.countdown < 0) {
            clearInterval(this.interval);
          }
        }, 1000)
      }
    });
    this.notification.showAlert.subscribe(show => this.isAlert = show);
  }

  onSave() {
    this.notification.userResponseGetter(true);
  }
  onCancel() {
    this.notification.userResponseGetter(false);
  }

  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval)
  }
}
