import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartController } from 'src/app/controller/cart-controller.service';
import { UserControllerService } from 'src/app/controller/user-controller.service';
import { inCart, userDetails } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-kart-items',
  templateUrl: './kart-items.component.html',
  styleUrls: ['./kart-items.component.css']
})
export class KartItemsComponent implements OnInit {

  apiBaseUrl: string = environment.imageBaseUrl;

  itemIncart: Set<inCart> = new Set();
  totalPrice: number = 0;
  cartItems: inCart[] = [];

  constructor(public cartController: CartController, private router: Router, private userDetails: UserControllerService) { }

  ngOnInit(): void {
    this.cartController.$inCart.subscribe(response => {
      this.itemIncart.clear();
      this.totalPrice = 0;
      response.forEach(item => {
        this.itemIncart.add(item);
      })
      this.cartItems = Array.from(this.itemIncart);
      this.totalPrice = 0;
      this.itemIncart.forEach(prod => {
        this.totalPrice += (prod.quantity * prod.finalPrice)
      })
    })
  }

  calculateGrandTotal(products: any[]): number {
    return products.reduce((sum, item) => sum + item.finalPrice);
  }

  updateProduct(action: 'Increase' | 'Decrease', itemId: number) {
    const index = this.cartItems.findIndex(i => i.id === itemId);
    if (action === 'Increase') {
      this.cartItems[index].quantity += 1;
      this.cartController.addCartItem = { productId: this.cartItems[index].product.productId, quantity: this.cartItems[index].quantity };
    } else if (action === 'Decrease') {
      this.cartItems[index].quantity -= 1;
      if (this.cartItems[index].quantity === 0) {
        this.cartController.removeCartItem(this.cartItems[index].product.productId);
      } else {
        this.cartController.addCartItem = { productId: this.cartItems[index].product.productId, quantity: this.cartItems[index].quantity };
      }
    }
  }

  submitOrder() {
    var details: userDetails = {} as userDetails;
    this.userDetails.$UserData.subscribe(response => {
      details = response;
    });
    this.userDetails.addressFound = true;
    this.router.navigate(['user/orderStatus']);
  }
}
