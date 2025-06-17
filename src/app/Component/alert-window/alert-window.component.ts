import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SearchService } from 'src/app/Services/search.service';

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

  constructor(private notification: SearchService) { }

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
    this.notification.type$.subscribe(data => this.alert = data);
    this.notification.isAlert.subscribe(show => this.isAlert = show);
  }

  onSave(){
    this.notification.task(true);
  }
  onCancel(){
    this.notification.task(false);
  }

}
