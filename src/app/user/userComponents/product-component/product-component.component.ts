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
    private addCartItem: CartController, private paginationHelper: PaginationHelperService
  ) { }

  ngOnInit(): void {
    this.draftItems = this.authunticateUser.getToken() ? sessionStorage.getItem('cartItemDraft')! : '';
    if (!!this.draftItems) {
      const cartItems = this.draftItems.split(' ');
      this.updateCartItems(cartItems[0], cartItems[1]);
    }
    this.productController.getFlag() ? '' : this.productController.fetchProducts(0, 15);
    this.productController.getProducts().subscribe(products => this.productList = products.filter(product => product.name !== ''));
    this.cartQuantity = this.addCartItem.getOnlyQty();
    this.paginator = this.paginationHelper.chunkInitializer(this.currentPage, 5);
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
    const isloggedin = !!this.authunticateUser.getToken();
    const isUser = this.authunticateUser.getUserRole() !== 'admin';
    if (isloggedin) {
      const requiredLoginConfirm = await this.interactive.open('confirm');
      if (requiredLoginConfirm) {
        this.interactive.jobDone('Redirected to login !.');
        sessionStorage.setItem('cartItemDraft', action + ' ' + itemId.toString());
        this.router.navigate(['login']);
      } else if (isUser) {
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

  goToFirst() {
    this.paginationHelper.chunkIndexer = 0;
    this.productController.setCurrentPage(0);
  }

  goToLast() {
    this.paginationHelper.chunkIndexer = Math.floor((this.totalPages - 1) / this.paginationHelper.pagePerChunk);
    this.productController.setCurrentPage(this.totalPages);
    this.productController.setItemSize(this.pageSize);
  }

}

