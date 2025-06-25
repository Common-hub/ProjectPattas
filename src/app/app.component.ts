import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductController } from './controller/productController.service';
import { AuthorizeService } from './core/guard/authorize.service';
import { UserInteractionService } from './core/service/user-interaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Suriya Pryo Park';
  isLoggedIn: boolean = false;
  navigations: { route: string; key: string; }[] = [];
  private inactivityLimit = 15 * 60 * 1000;

  constructor(private router: Router, private activityMonitor: AuthorizeService, private producthandeler: ProductController, private search: UserInteractionService,
    private spinner: NgxSpinnerService) {
    activityMonitor.reStoreFromSession();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        producthandeler.fetchProducts(0, 30);
        spinner.show();
      }
      else if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        this.isLoggedIn = activityMonitor.isUserLoggedIn || currentRoute.startsWith('/user/productsList');
        setTimeout(() => {
          spinner.hide();
        }, 5890);
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          spinner.hide();
        }, 5890);
      }
    })
  }

  ngOnInit(): void {
    this.activityMonitor.setupActivityListeners();
    setTimeout(() => {
      this.activityMonitor.checkActivity()
    }, this.inactivityLimit);
    this.navigations = this.activityMonitor.allowedRoutes();
  }

  logout() {
    this.activityMonitor.isUserLoggedIn ? this.search.openWindow('confirmLogout') : this.search.openWindow('confirmLogin');
  }
}
