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

  apiBaseUrl: string = environment.apiBaseUrl.replace('api/', '');

  itemIncart: inCart[] = [];
  grandTotal: number = 0;

  constructor(private cartController: CartController, private router: Router, private userDetails: UserControllerService) { }

  ngOnInit(): void {
    this.cartController.$inCart.subscribe(response => {
      response.forEach(item => {
        this.itemIncart.push(item);
        this.grandTotal += item.product.price * item.quantity;
      })
    })
    console.log(this.itemIncart.length);

  }

  updateProduct(action: 'Increase' | 'Decrease', itemId: number) {
    const index = this.itemIncart.findIndex(i => i.id === itemId);
    if (action === 'Increase') {
      this.itemIncart[index].quantity += 1;
      this.cartController.addCartItem = { productId: this.itemIncart[index].product.productId, quantity: this.itemIncart[index].quantity };
    } else if (action === 'Decrease') {
      if (this.itemIncart[index].quantity === 0)
        this.cartController.removeCartItem(this.itemIncart[index].product.productId);
      this.itemIncart[index].quantity -= 1;
      this.cartController.addCartItem = { productId: this.itemIncart[index].product.productId, quantity: this.itemIncart[index].quantity };
    }
    this.getgrandTotal();
  }

  getgrandTotal(): number {
    this.cartController.$inCart.subscribe(response => {
      response.forEach(item => {
        this.grandTotal += item.product.price * item.quantity;
      })
    })
    return this.grandTotal;
  }

  submitOrder() {
    var details: userDetails = {} as userDetails;
    this.userDetails.$UserData.subscribe(response => {
      details = response;
    });
    if (details.address) {
      this.userDetails.postOrder(details.address);
      this.router.navigate(['user/orderStatus']);
    } else {
      this.userDetails.addressFound = true;
      this.router.navigate(['user/orderStatus']);
    }
  }

}
