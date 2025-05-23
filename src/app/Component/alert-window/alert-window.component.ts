import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.css']
})
export class AlertWindowComponent implements OnInit{

  @Input() message: string = '';
  @Input() alertType: string  = 'success';
  isVisible: boolean = false;
  private alertTimeOut: any

  constructor() {}
  
   ngOnInit(): void {}

}
