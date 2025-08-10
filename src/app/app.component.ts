import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductController } from './controller/productController.service';
import { UserControllerService } from './controller/user-controller.service';
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
  shopInfo: any = {};

  constructor(
    private router: Router,
    private activityMonitor: AuthorizeService,
    private producthandeler: ProductController,
    private search: UserInteractionService,
    private shop: UserControllerService
  ) {
    activityMonitor.reStoreFromSession();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        this.isLoggedIn = activityMonitor.isUserLoggedIn || currentRoute.startsWith('/user/productsList')
      }
    })
  }

  ngOnInit(): void {
    this.activityMonitor.routes.subscribe(routes => {
      this.navigations = routes;
    });
    this.shop.getShop().subscribe((data: any) => {
      this.shopInfo = data;
    },
      (error: any) => {
        console.error('Error fetching shop information:', error);
      })
    this.producthandeler.fetchProducts(0, 15);
  }

  logout() {
    this.activityMonitor.isUserLoggedIn ? this.search.openWindow('confirmLogout') : this.search.openWindow('confirmLogin');
    this.activityMonitor.clear();
    this.activityMonitor.allowedRoutes();
  }
}
