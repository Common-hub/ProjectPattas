import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cartItems, CartProducts, Product } from 'src/app/models';
import { AuthorizeService } from 'src/app/Services/authorize.service';
import { CartController } from 'src/app/Services/cart-controller.service';
import { PaginationHelperService } from 'src/app/Services/pagination-helper.service';
import { ProductController } from 'src/app/Services/productController.service';
import { UserInteractionService } from 'src/app/Services/user-interaction.service';
import { environment } from 'src/environments/environment';

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
  cartQuantity: number[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 0;
  paginator: number[] = [];

  constructor(public productController: ProductController, private router: Router, private interactive: UserInteractionService, private authunticateUser: AuthorizeService,
    private addCartItem: CartController) { }

  ngOnInit(): void {
    this.draftItems = this.authunticateUser.getToken();
    this.productController.getProducts().subscribe(products => {
      this.productList = products.filter(product => product.name !== '' && product.name !== undefined && product.name !== null);
      this.cartQuantity = !this.draftItems ? new Array(this.productList.length).fill(0) : [];
    });
    if (this.draftItems !== '') {
      const cartItems = sessionStorage.getItem('cartItemDraft')!.split(' '); //this.draftItems.split(' ');
      this.updateCartItems(cartItems[0] as 'addItem' | 'removeItem', Number(cartItems[1]));
      this.cartQuantity = this.addCartItem.getOnlyQty();
      if(this.cartQuantity.length < 1) this.cartQuantity = new Array(this.productList.length).fill(0);
    }
    console.log(this.cartQuantity, this.draftItems);
    if (this.productList.length < 1) this.productController.fetchProducts(0, 12);
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
    const isloggedin = this.authunticateUser.getConfirmation();
    const isUser = this.authunticateUser.getUserRole() === 'user';
    if (isloggedin) {
      console.log((itemId));
      
      if (isUser) {
        if (action === 'addItem') {
          this.cartQuantity[itemId]++;
          this.addCartItem.setAddCartItem({ productId: this.productList[itemId].id, quantity: this.cartQuantity[itemId] });
        } else if (action === 'removeItem' && this.cartQuantity[itemId] > 0) {
          this.cartQuantity[itemId]--;
          this.addCartItem.setAddCartItem({ productId: this.productList[itemId].id, quantity: this.cartQuantity[itemId] });
        } else if (this.cartQuantity[itemId] === 0) {
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
    this.productController.setCurrentPage(this.currentPage);
  }

  changeSize(event: Event) {
    this.pageSize = Number((event.target as HTMLInputElement).value);
    this.productController.setItemSize(this.pageSize);
  }

}

