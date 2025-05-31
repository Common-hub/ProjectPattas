import { Component, OnInit } from '@angular/core';
import { ApiInteractionService } from '../../../Services/api-interaction.service';
import { products } from 'src/app/models/user';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/Services/search.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'product',
  templateUrl: './product-component.component.html',
  styleUrls: ['./product-component.component.css']
})
export class ProductComponent implements OnInit {
  productList: products[] = []
  unSortedProduct: products[] = []
  _filterdList: products[] = [];
  quantity: number[] = [];
  pages: number[] = [];
  token: string | null = "";
  errorMsg: string = "";
  totalPages: number = 0;
  type: string = "";
  currentpage: number = 0;
  private updatedQty = new Subject<{productId: any; quantity: any}>();
  constructor(private apiIteraction: ApiInteractionService, private router: Router, private search: SearchService) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token')
    this.fetchProducts(this.currentpage, 12);
    this.updatepages();
    this.updatedQty.pipe(debounceTime(600)).subscribe(({productId, quantity}:any )=>{
       this.apiIteraction.addCart({ productId: productId, quantity: quantity }).
        subscribe(resp => {
          this.errorMsg = ''
          setTimeout(() => this.errorMsg = resp, 12)
          this.type = 'success'
        })
    })
  }

  updatepages(){
    const range = 0;
    this.pages = [];
    for(let i = 1; i <= this.totalPages; i++){
      this.pages.push(i)
    }
  }

  goToFirst(){
    this.fetchProducts(0, 12)
  }
  goToLast(){    
    this.fetchProducts(this.totalPages-1, 12)
    console.log(this.currentpage === this.totalPages-1, this.currentpage, this.totalPages);
  }

  fetchProducts(page: number, size: number) {
    this.currentpage = page;
    this.apiIteraction.getProducts(page, size).subscribe(res => {
      console.log(res);
      this.totalPages = res.totalPages;
      page = res.number;
      this.productList = res.content;
      this._filterdList = [...res.content];
      this.search.currentSearch.subscribe(term => {
        const input = term.trim().toLowerCase();
        if (!input) {
          this.productList = [...this._filterdList];
        } else {
          this.productList = this._filterdList.filter(products => products.name.toLowerCase().includes(input))
          if (this.productList.length == 0) this.fetchProducts(0, 12 * this.totalPages);
        }
      })
      this.quantity = new Array(this.productList.length).fill(0);
      if (this.token) {
        this.apiIteraction.getCart().subscribe((cartItems: any[]) => {
          cartItems.forEach(cart => {
            const index = this.productList.findIndex(product => product.id === cart.product.id);
            this.quantity.splice(index, 0, cart.quantity)
          })
        })
      }
      this.updatepages();
      this.unSortedProduct = [...this.productList]      
    });
  }

  cartQty(mode: string, i: number) {
    if (!this.token) {
      this.router.navigate(['/login'])
    }
    else {  
      if (mode === "d" && this.quantity[i] > 0) {
        this.quantity[i]--;
      }
      if (mode === 'in') this.quantity[i]++;
    }
    this.updatedQty.next({productId: this.productList[i].id, quantity: this.quantity[i]})
  }

  sortProduct(type: string){
    switch(type){
      case 'aPrice': 
       this.productList = this.productList.sort((a,b)=> a.price - b.price);
       break;
      case 'dPrice': 
       this.productList = this.productList.sort((a,b)=> b.price - a.price);
       break;
      case 'aName': 
       this.productList = this.productList.sort((a,b)=> a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
       break;
      case 'dName': 
       this.productList = this.productList.sort((a,b)=> b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
       break;
      default: 
       this.productList = this.unSortedProduct;
       break;
    }
  }

}

