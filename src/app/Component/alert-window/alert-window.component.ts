import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.css']
})
export class AlertWindowComponent implements OnChanges{

  @Input() message: string = '';
  @Input() alertType: string  = 'success';
  isVisible: boolean = false;

  constructor() {}
  
   ngOnChanges(changes: SimpleChanges): void {    
    if(changes['message'] && this.message){
      this.isVisible = true;
      setTimeout(()=> this.isVisible = false, 3000)
      setTimeout(()=> this.message = '', 3000)
    }
   }

}
