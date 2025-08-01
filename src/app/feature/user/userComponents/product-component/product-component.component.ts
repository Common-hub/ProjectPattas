import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartController } from 'src/app/controller/cart-controller.service';
import { ProductController } from 'src/app/controller/productController.service';
import { AuthorizeService } from 'src/app/core/guard/authorize.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';
import { cartItems, Product } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';
;

@Component({
  selector: 'product',
  templateUrl: './product-component.component.html',
  styleUrls: ['./product-component.component.css']
})
export class ProductComponent implements OnInit {

  apiBaseUrl: string = environment.imageBaseUrl;

  productList: Product[] = [];
  unSortedProduct: Product[] = [];
  draftItems: any;
  cartQuantity: cartItems[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 0;
  paginator: number[] = [];

  constructor(public productController: ProductController, private router: Router, private interactive: UserInteractionService, private authunticateUser: AuthorizeService,
    private addCartItem: CartController) { }

  ngOnInit(): void {
    this.productController._productList.subscribe((products: Product[]) => {
      this.productList = products.filter(product => product.name !== '' && product.name !== undefined && product.name !== null);
      products.forEach(product => {
        this.cartQuantity.push({ productId: product.id, quantity: 0 })
      })
    });
    if (this.authunticateUser.isUserLoggedIn) {
      this.addCartItem.$inCart.subscribe(response => {
        response.forEach(item => {
          const index = this.cartQuantity.findIndex(i => i.productId === item.product.productId);
          this.cartQuantity[index].quantity = item.quantity;
        })
      });
    }
  }

  sortProducts(type: string): void {
    const sortStrategies: { [key: string]: (a: Product, b: Product) => number } = {
      aPrice: (a, b) => a.price - b.price,
      dPrice: (a, b) => b.price - a.price,
      aName: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      dName: (a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()),
    };

    this.productList = sortStrategies[type]
      ? [...this.productList].sort(sortStrategies[type])
      : [...this.unSortedProduct];
  }

  async updateCartItems(action: 'addItem' | 'removeItem', productId: number) {
    const index = this.productList.findIndex(product => product.id === productId);
    const isloggedin = this.authunticateUser.isUserLoggedIn;
    const isUser = this.authunticateUser.userAuthority === 'user';
    if (isloggedin && isUser) {
      if (action === 'addItem') {
        this.cartQuantity[index].quantity += 1;
        this.addCartItem.addCartItem = this.cartQuantity[index];
      }
      else if (action === 'removeItem' && this.cartQuantity[index].quantity > 0) {
        this.cartQuantity[index].quantity -= 1;
        this.addCartItem.addCartItem = this.cartQuantity[index];
      } else if (action === 'removeItem' && this.cartQuantity[index].quantity == 0) {
        this.addCartItem.removeCartItem(this.cartQuantity[index].productId)
      }
    } else {
      const requiredLoginConfirm = await this.interactive.openWindow('confirmLogin');
      if (requiredLoginConfirm) {
        this.interactive.sppInfo('Redirected to login !.');
        this.router.navigate(['login']);
      } else {
        this.interactive.sppWarning("Login to continue the Action.")
      }
    }
  }


  changePage(page: number) {
    this.currentPage = page;
    this.productController.currentPageNumber = this.currentPage;
  }

  changeSize(event: Event) {
    this.pageSize = Number((event.target as HTMLInputElement).value);
    this.productController.itemsPerPage = this.pageSize;
  }

}

