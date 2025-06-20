import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models';
import { PaginationHelperService } from 'src/app/Services/pagination-helper.service';
import { ProductController } from 'src/app/Services/productController.service';
import { UserInteractionService } from 'src/app/Services/user-interaction.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.scss']
})
export class ProductDataComponent implements OnInit {

  apiBaseUrl:string = environment.apiBaseUrl;

  isEdit: boolean = false;
  currentpage: number = 0;
  totalPages: number = 0;
  size: number = 0;
  start: number = 1;
  pages: number[] = [];
  pagesPerChunk: number = 0;
  editableItem: number | null = null;
  productsList: Product[] = [];
  flagCheck!: Product;
  constructor(private notification: UserInteractionService, public productController: ProductController, private paginationHelper: PaginationHelperService) { }

  ngOnInit(): void {
    this.productController.getFlag() ? '' : this.productController.fetchProducts(0, 15);
    this.productController.getProducts().subscribe(products => this.productsList =  products.filter(product=>product.name !== ''));
    this.totalPages = this.productController.getTotalPages();
    this.pages = this.paginationHelper.chunkInitializer(this.currentpage, 5);
  }

  updateProduct(index: number) {
    this.isEdit = false;
    this.editableItem = index;
    this.productController.putProductsByid(this.productsList[index].id, this.productsList[index]);
  }

  deleteProduct(id: number) {
    this.productController.deleteProduct(id);
  }

  async enableEdit(index: number) {
    if (this.isEdit) {
      var editedFlag = false;
      editedFlag = this.productsList[index].name !== this.flagCheck.name ||
        this.productsList[index].imageUrl !== this.flagCheck.imageUrl || this.productsList[index].price !== this.flagCheck.price ||
        this.productsList[index].stockQuantity !== this.flagCheck.stockQuantity || this.productsList[index].description !== this.flagCheck.description;
      if (editedFlag) {
        const confirm = await this.notification.open('confirm')
        if (confirm) {
          this.productsList[index] = this.productsList[index];
          this.isEdit = false;
        } else {
          this.productsList[index] = this.flagCheck;
        }
      } else {
        this.isEdit = false
      }
    } else {
      this.isEdit = true;
      this.editableItem = index;
      this.flagCheck = JSON.parse(JSON.stringify(this.productsList[index]));
    }
  }

  changePage(page: number) {
    this.currentpage = page;
    this.productController.setCurrentPage(this.currentpage);
  }

  changeSize(event: Event) {
    this.size = Number((event.target as HTMLInputElement).value);
    this.productController.setItemSize(this.size);
  }

  goToFirst() {
    this.paginationHelper.chunkIndexer =0;
    this.productController.setCurrentPage(0);
  }

  goToLast() {
    this.paginationHelper.chunkIndexer = Math.floor((this.totalPages-1)/this.paginationHelper.pagePerChunk);
    this.productController.setCurrentPage(this.totalPages);
    this.productController.setItemSize(this.size);
  }

}
