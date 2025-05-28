import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';

@Component({
  selector: 'app-kart-items',
  templateUrl: './kart-items.component.html',
  styleUrls: ['./kart-items.component.scss']
})
export class KartItemsComponent implements OnInit {
  cartItems: any[] = [];
  errorMsg: string = '';
  type: string = '';
  grandTotal: number = 0;
  taxes: number = 0;

  constructor(private apiInteraction: ApiInteractionService, private router: Router) { }

  ngOnInit(): void {
    this.getCartItems();
  }

  getSubtotal() {
    let subTotal: number = 0.00;
    this.cartItems.forEach(sub => {
      subTotal = Number((subTotal + sub.subTotal).toFixed(3));
    });
    return subTotal;
  }

  getCartItems() {
    this.cartItems = []
    this.apiInteraction.getCart().subscribe((resp: any[]) => {
      if (resp.length == 0) this.router.navigate(['productsList']);
      else {
        resp.forEach(cartItem => {
          const total: number = Number((cartItem.product.price * cartItem.quantity).toFixed(3));
          this.cartItems.push(
            {
              product: cartItem.product,
              qty: cartItem.quantity,
              subTotal: total// Ensure total is a number
            });
        });
      }
    });
  }

  gTotal(): number {
    let total = 0;
    this.cartItems.forEach(sub => total += sub.subTotal);
    return Number(this.taxes + total)
  }

  updateCart(i: number) {
    // Update item quantity    
    if(this.cartItems[i].qty > 0 ){
      this.apiInteraction.addCart({
      productId: this.cartItems[i].product.id,
      quantity: Number(this.cartItems[i].qty)
    }).subscribe(resp => {
      this.cartItems = [];
      this.errorMsg = '';
      setTimeout(() => {
        this.errorMsg = resp;
      }, 10);
      this.type = 'success'
      this.getCartItems();
    });
    }else{
      this.apiInteraction.deleteCart(this.cartItems[i].product.id).subscribe(resp => {
        this.errorMsg = '';
        setTimeout(() => {
          this.errorMsg = resp;
        }, 10);
        this.type = 'success'
        setTimeout(() => {
          this.getCartItems();
        }, 10);
      })
    }
  }

  onCheckout(){}

  navigate() {
    this.router.navigate(['productsList'])
  }

}
