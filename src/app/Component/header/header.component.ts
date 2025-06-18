import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { AuthorizeService } from 'src/app/Services/authorize.service';
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

  constructor(private router: Router, private search: SearchService, private api: ApiInteractionService, private authorize: AuthorizeService) { }

  ngOnInit(): void {
    this.fetchproducts(this.page, this.size);
    this.isAdmin = sessionStorage.getItem('Autorized') === 'true' ? true : false;
  }

  fetchproducts(page: number, size: number) {
    this.api.getProducts(page, size).subscribe(product => {
      this.names = product.content.map((p: any) => p.name);
      this.totalPages = product.totalPages;
    })    
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
        this.search.setSearch(term);
      }
    } else {
      const search = term.target as HTMLInputElement;
      if (search.value.length >= 1) {
        this.fetchproducts(this.page, this.size * this.totalPages)
        this.suggest = this.names.filter(name => name.toLowerCase().includes(search.value.toLowerCase()));;
        if (this.suggest.length == 0) {
          this.search.jobError("No Matching products found!!")
        } else {
          this.search.setSearch(search.value);
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
        this.authorize.setToken('');
        this.router.navigate(['/productsList'])
      }
    }else{
      this.search.jobfail("Login!!");
      this.router.navigate(['login'])
    }
  }
}
