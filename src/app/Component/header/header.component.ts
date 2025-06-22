import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { AuthorizeService } from 'src/app/Services/authorize.service';
import { ProductController } from 'src/app/Services/productController.service';
import { UserInteractionService } from 'src/app/Services/user-interaction.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  errorMsg: string = "";
  type: string = "";
  searchKey: string = "";
  names: string[] = [];
  suggestions: string[] = [];
  navigations: { route: string; key: string; }[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private search: UserInteractionService, private api: ApiInteractionService, private authorize: AuthorizeService,
    private productHndler: ProductController
  ) { }

  ngOnInit(): void {
    if (this.authorize.isUserLoggedIn) {
      this.allowedRoutes(this.authorize.userAuthority);
      console.log(this.authorize.isUserLoggedIn);
    }
    setTimeout(() => {
      console.log(this.navigations);
      this.search.getSuggestions().subscribe(respnseName => this.names = respnseName);
      console.log(this.names);
    }, 10000);
  }

  showCart() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['viewCart'])
    }
    else {
      this.router.navigate(['login'])
    }
  }

  onsearch(term: Event | string) {
    const searchKeyword = typeof term === 'string' ? term : (term.target as HTMLInputElement).value.length >= 1 ? (term.target as HTMLInputElement).value : '';
    if (searchKeyword !== '') {
      const identifiedMatched = this.names.filter(keyword => keyword.toLowerCase().includes(searchKeyword.toLowerCase()));
      if (identifiedMatched.length >= 1) {
        this.suggestions = identifiedMatched;
      }
    }
  }

  allowedRoutes(userRole: string) {
    if (userRole === 'admin') {
      this.navigations = [
        { route: 'admin/dashBoard', key: `<span class="bi bi-speedometer2"></span>&nbsp; DashBoard` },
        { route: 'admin/addProducts', key: `<span class="bi bi-cart-plus"></span>&nbsp; Inventory` },
        { route: 'admin/productsList', key: `<span class="bi bi-view-list"></span>&nbsp; ProductList` }]
    } else if (userRole === 'user') {
      this.navigations = [
        { route: 'user/productsList', key: `<span class="bi bi-houses"></span>&nbsp; Home` },
        { route: 'user/viewCart', key: `<span class="bi bi-cart3"></span>&nbsp; View Cart` },
        { route: 'user/orderStatus', key: `<span class="bi bi-bag-check-fill"></span>&nbsp; Orders` }
      ]
    }
  }

  showProfile() {
    if (sessionStorage.getItem('token')) { } else {
      this.errorMsg = "Login to see Profile Details";
      this.type = " warning"
      setTimeout(() => {
        this.errorMsg = ""
      }, 3000);
    }
  }

  logout() {
    this.authorize.isUserLoggedIn ? this.search.openWindow('confirmLogout') : this.search.openWindow('confirmLogin');
  }
}
