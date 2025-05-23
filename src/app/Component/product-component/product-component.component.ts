import { Component, OnInit } from '@angular/core';
import { ApiInteractionService } from '../../Services/api-interaction.service';
import { products } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'product',
  templateUrl: './product-component.component.html',
  styleUrls: ['./product-component.component.css']
})
export class ProductComponent implements OnInit {
  productList: products[] = []
  token:string | null = "";
  errorMsg:string = "";
  type: string = "";
  quantity: number[] = [];

  constructor(private apiIteraction:ApiInteractionService, private router: Router) { }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('token'));
    
   this.token = sessionStorage.getItem('token')
    this.apiIteraction.getProducts().subscribe(res=>{
      this.productList = res.content
      this.quantity = new Array(this.productList.length).fill(0);
    })
  }

  cartQty(mode:string, i: number){    
    if(this.token){
      if(mode === "d" && this.quantity[i] > 0){
      this.quantity[i]--;
    }
    if(mode === 'in') this.quantity[i]++;

    this.apiIteraction.addCart({productId: this.productList[i].id, quantity: this.quantity[i]}).
    subscribe(resp=> {
      this.errorMsg = resp;
      this.type = 'success'
    })
    }
    else{
      this.router.navigate(['/login'])
    }
  }

}
