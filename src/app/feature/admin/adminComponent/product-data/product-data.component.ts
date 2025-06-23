import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/models';
import { AuthorizeService } from 'src/app/core/gaurdds/authorize.service';
import { PaginationHelperService } from 'src/app/Services/pagination-helper.service';
import { ProductController } from 'src/app/Services/productController.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.css']
})
export class ProductDataComponent implements OnInit {

  apiBaseUrl: string = environment.apiBaseUrl;

  isEdit: boolean = false;
  currentpage: number = 0;
  totalPages: number = 0;
  size: number = 0;
  start: number = 1;
  pages: number[] = [];
  pagesPerChunk: number = 0;
  editableItem: number | null = null;
  productsList: Product[] = [];
  unSortedProduct: Product[] = [];
  flagCheck!: Product;
  productUpdation!: FormGroup;

  constructor(private notification: UserInteractionService, public productController: ProductController, private formBuilder: FormBuilder, private authunticateUser: AuthorizeService) { }

  ngOnInit(): void {
    this.productController._productList.subscribe(products => {
      this.productsList = products.filter(product => product.name !== '' && product.name !== undefined && product.name !== null);
      this.unSortedProduct = [...this.productsList];
    });
    this.totalPages = this.productController.TotalPages;
    this.productUpdation = this.formBuilder.group({
      stockQuantity: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  updateProduct(index: number) {
    this.isEdit = false;
    const i = this.productsList.findIndex(product => product.id === index)
    this.productController.putProductsByid(this.productsList[i].id, this.productsList[i]);
    this.editableItem = null
  }

  deleteProduct(id: number) {
    this.productController.deleteProduct(id);
  }

  sortProducts(type: keyof Product, ascending: boolean = false): void {
    this.productsList.sort((a, b) => {
      // 1. Always put editable row on top
      if (this.editableItem != null) {
        if (a.id === this.editableItem) return -1;
        if (b.id === this.editableItem) return 1;
      }

      // 2. Handle string comparison safely
      const aValue = a[type];
      const bValue = b[type];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return ascending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 3. Handle number/date comparison
      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;

      return 0;
    });
    this.productController.productsList = this.productsList;
  }

  async enableEdit(index: number) {
    const i = this.productsList.findIndex(product => product.id === index)
    if (this.isEdit) {
      var editedFlag = false;
      editedFlag = this.productsList[i].imageUrl !== this.flagCheck.imageUrl || Number(this.productsList[i].price) !== Number(this.flagCheck.price) ||
        Number(this.productsList[i].stockQuantity) !== Number(this.flagCheck.stockQuantity);
      if (editedFlag) {
        const confirm = await this.notification.openWindow('confirm')
        if (confirm) {
          this.isEdit = false;
          this.editableItem = null;
          this.productController.productsList = this.productsList;
        } else {
          this.isEdit = false;
          this.editableItem = null;
          this.productsList[i] = this.flagCheck;
        }
      } else {
        this.isEdit = false;
        this.editableItem = null;
      }
    } else {
      this.isEdit = true;
      this.editableItem = index;
      this.flagCheck = { ...this.productsList[i] };
      console.log(this.flagCheck);

    }
  }

  changePage(page: number) {
    this.currentpage = page;
    this.productController.currentPageNumber = this.currentpage;
  }

  changeSize(event: Event) {
    this.size = Number((event.target as HTMLInputElement).value);
    this.productController.itemsPerPage = this.size;
  }

  restrictText(event: any, input: string) {
    const inputValue = event.target.value.trim();

    var regex: RegExp = /^\d+$/;
    if (input === 'price') regex = /^\d+(\.\d{0,2})?$/;

    if (inputValue !== '' && !regex.test(inputValue)) {
      event.target.value = inputValue.slice(0, -1);
    }
  }
}
