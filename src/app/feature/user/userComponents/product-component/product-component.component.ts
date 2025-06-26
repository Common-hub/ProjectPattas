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

  apiBaseUrl: string = environment.apiBaseUrl;

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
    this.productController._productList.subscribe(products => {
      this.productList = products.filter(product => product.name !== '' && product.name !== undefined && product.name !== null);
      this.cartQuantity = Array(this.productList.length).fill({ productId: 0, quantity: 0 })
    });
    if (this.authunticateUser.isUserLoggedIn) {
      const draftItems = sessionStorage.getItem('cartItemDraft');
      if (draftItems) {
        const cartItems = draftItems.split(' ') //this.draftItems.split(' ');
        this.updateCartItems(cartItems[0] as 'addItem' | 'removeItem', Number(cartItems[1]));
      }
      this.addCartItem.cartItems.subscribe(items => {
        if (items.length >= 1) {
          this.cartQuantity = items;
          const missingCount = this.productList.length - this.cartQuantity.length;
          if (missingCount > 0) {
            const filler = Array(missingCount).fill({ productId: 0, quantity: 0 });
            this.cartQuantity.push(...filler);
          }
        } else {
          this.cartQuantity = Array(this.productList.length).fill({ productId: 0, quantity: 0 });
        }
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

  async updateCartItems(action: 'addItem' | 'removeItem', itemId: number) {
    const isloggedin = this.authunticateUser.isUserLoggedIn;
    const isUser = this.authunticateUser.userAuthority === 'user';
    if (isloggedin) {
      this.addCartItem.productToCart // remove later
      this.cartQuantity[itemId].productId = this.productList[itemId].id;
      if (isUser) {
        if (action === 'addItem') {
          this.cartQuantity[itemId].quantity++;
          this.addCartItem.cartItem = this.cartQuantity[itemId];
        } else if (action === 'removeItem' && this.cartQuantity[itemId].quantity > 0) {
          this.cartQuantity[itemId].quantity--;
          this.addCartItem.cartItem = this.cartQuantity[itemId];
        } else if (this.cartQuantity[itemId].quantity === 0) {
          this.addCartItem.removeCartItem(this.productList[itemId].id);
        }
      }
    } else {
      const requiredLoginConfirm = await this.interactive.openWindow('confirmLogin');
      if (requiredLoginConfirm) {
        this.interactive.sppInfo('Redirected to login !.');
        sessionStorage.setItem('cartItemDraft', action + ' ' + itemId.toString());
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

