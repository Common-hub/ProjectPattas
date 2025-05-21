import { Component, OnInit } from '@angular/core';
import { ApiInteractionService } from '../../Services/api-interaction.service';

@Component({
  selector: 'product',
  templateUrl: './product-component.component.html',
  styleUrls: ['./product-component.component.css']
})
export class ProductComponent implements OnInit {
  productList:any = []

  constructor(private apiIteraction:ApiInteractionService) { }

  ngOnInit(): void {
    this.apiIteraction.getProducts().subscribe(res=>{
      this.productList = res.products
      console.log(res);      
    })
  }

}
