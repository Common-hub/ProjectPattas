import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductController } from 'src/app/controller/productController.service';
import { UserControllerService } from 'src/app/controller/user-controller.service';
import { AuthorizeService } from 'src/app/core/guard/authorize.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';

@Component({
  selector: 'searchbar',
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
  hide: boolean = false;
screenWidth: any;

  constructor(private router: Router, private route: ActivatedRoute, private search: UserInteractionService, private api: UserControllerService, private authorize: AuthorizeService, private searchResult: ProductController) { }

  ngOnInit(): void {
    this.navigations = this.authorize.isUserLoggedIn ? this.authorize.allowedRoutes() : [];
    setTimeout(() => {
      this.search.getSuggestions().subscribe(respnseName => {
        const suggestions: Set<string> = new Set();
        respnseName.forEach(suggest => {
          suggestions.add(suggest);
          this.names = Array.from(suggestions);
        })
      });
    }, 1000);
    const searchParam = this.route.snapshot.queryParamMap.get('search');
    if (searchParam == '') {
      // Clear the 'search' query param on page load
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      }).then(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: this.searchKey },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      });
    }

  }

  showCart() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['viewCart'])
    }
    else {
      this.router.navigate(['login'])
    }
  }

  showSearch() {
    const url = this.authorize.isUserLoggedIn ? `/${this.authorize.userAuthority}/productsList` : '/user/productsList';
    return this.router.url.includes(url);
  }

  onsearch(term: Event | string) {
    const input = typeof term === 'string' ? term : (term.target as HTMLInputElement).value;
    this.hide = false;
    if (typeof term === 'string') {
      this.searchKey = term;
    }
    const searchKeyword = input.trim();

    if (searchKeyword !== '') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      }).then(() => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { search: this.searchKey },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      });
      const identifiedMatched = this.names.filter(keyword =>
        keyword.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      this.suggestions = identifiedMatched.length >= 1 ? identifiedMatched : [];
    } else {
      this.searchKey = '';
      this.suggestions = [];
      this.searchResult.fetchProducts(0, 15);
    }
  }

  selectedProduct(name: string) {
    this.hide = true;
    this.searchKey = name;
    this.searchResult.searchWord = this.searchKey;
    this.router.navigate([`/${this.authorize.userAuthority}/productsList`], { queryParams: { search: this.searchKey } });
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
    this.authorize.isUserLoggedIn ? this.search.openWindow('confirmLogout') : this.router.navigate(['login']);
  }
}
