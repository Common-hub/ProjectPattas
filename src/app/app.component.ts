import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthorizeService } from './Services/authorize.service';
import { ProductHandlerService } from './Services/producthandler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Suriya Pryo Park';
  isLoggedIn: boolean = false;
  private inactivityLimit = 15 * 60 * 1000;
  
  constructor(private router: Router, private activityMonitor: AuthorizeService, private producthandeler: ProductHandlerService){    
    activityMonitor.reStoreFromSession();
    producthandeler.fetchProducts(0,15);
    this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        const currentRoute = event.urlAfterRedirects;
        this.isLoggedIn = !!sessionStorage.getItem('token') || currentRoute.startsWith('/user/productsList');
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
