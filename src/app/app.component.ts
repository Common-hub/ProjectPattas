import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthorizeService } from './Services/authorize.service';
import { ProductController } from './Services/productController.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Suriya Pryo Park';
  isLoggedIn: boolean = false;
  private inactivityLimit = 15 * 60 * 1000;
  
  constructor(private router: Router, private activityMonitor: AuthorizeService, private producthandeler: ProductController, 
    private spinner: NgxSpinnerService){    
    activityMonitor.reStoreFromSession();
    producthandeler.fetchProducts(0,15);
    this.router.events.subscribe(event =>{
      if (event instanceof NavigationStart) 
      spinner.show();
      else if(event instanceof NavigationEnd){
        const currentRoute = event.urlAfterRedirects;
        this.isLoggedIn = !!activityMonitor.getToken() || currentRoute.startsWith('/user/productsList');
        setTimeout(() => {
          spinner.hide();
        }, 5);
      }
      if(event instanceof NavigationCancel|| event instanceof NavigationError){
        setTimeout(() => {
          spinner.hide();
        }, 5);
      }
    })
  }

  ngOnInit(): void {
    this.activityMonitor.setupActivityListeners();
    setTimeout(() => {
      this.activityMonitor.checkActivity()
    }, this.inactivityLimit);
  }
}
