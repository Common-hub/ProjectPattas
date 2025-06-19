import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { AuthorizeService } from 'src/app/Services/authorize.service';
import { ProductHandlerService } from 'src/app/Services/producthandler.service';
import { SearchService } from 'src/app/Services/search.service';

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
  suggest: string[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  isAdmin: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private search: SearchService, private api: ApiInteractionService, private authorize: AuthorizeService,
    private productHndler: ProductHandlerService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authorize.getUserRole() === 'admin' ? true : false;
    this.search.$resultProducts.pipe(filter(names=> names && names.length > 0)).subscribe(resultNames=>this.names = resultNames);
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
    if (typeof term === 'string') {
      if (term) {
        this.suggest = []
        this.searchKey = term;
         this.router.navigate(['/'+this.authorize.getUserRole()+'/productsList'],
          {relativeTo: this.route,
            queryParams: {search: term},
            queryParamsHandling: 'merge',
            replaceUrl: true
          })
        this.search.setSearch(term);
          this.productHndler.filteredProducts(term)
      }
    } else {
      const search = term.target as HTMLInputElement;
      if (search.value.length >= 1) {
        this.router.navigate([],
          {relativeTo: this.route,
            queryParams: {search: search.value},
            queryParamsHandling: 'merge',
            replaceUrl: true
          }
        )
        this.suggest = this.names.filter(name => name.toLowerCase().includes(search.value.toLowerCase()));
        if (this.suggest.length == 0) {
          this.search.jobError("No Matching products found!!")
        } else {
          this.search.setSearch(search.value);
          this.productHndler.filteredProducts(search.value)
        }
      }
      else {
        this.suggest = []
        this.search.setSearch('')
      }
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

  async logout(){
    if(this.authorize.getToken() !== ''){
      const confirm = await this.search.open('alert');
      if(confirm){
        this.authorize.clear();
        setTimeout(() => {
        this.router.navigate(['user/productsList'])   
        this.isAdmin = false;       
        }, 30);
      }
    }else{
      this.search.jobfail("Login!!");
      this.router.navigate(['login'])
    }
  }
}
