import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductController } from 'src/app/controller/productController.service';
import { AuthorizeService } from 'src/app/core/guard/authorize.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';
import { Product } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.css']
})
export class ProductDataComponent implements OnInit {

  apiBaseUrl: string = environment.imageBaseUrl;
  // imageBaseUrl: string = environment.imageBaseUrl;

  imageFile!: File;
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
      price: ['', Validators.required],
      active: ['', Validators.required],
    })
  }

  async updateProduct(productId: number, isUpdate?: boolean) {
    const updatedItem = new FormData();
    const index = this.productsList.findIndex(p => p.id === productId);
    if (index === -1) return; // Product not found
    const price = parseFloat(Number(this.flagCheck.price).toFixed(2)).toString();
    updatedItem.append('name', this.flagCheck.name);
    updatedItem.append('description', this.flagCheck.description);
    updatedItem.append('price', price);
    updatedItem.append('stockQuantity', this.flagCheck.stockQuantity.toString());
    if (this.imageFile) {
      updatedItem.append('image', this.imageFile);
    }
    updatedItem.append('active', this.flagCheck.active.toString());
    updatedItem.append('discount', this.flagCheck.discount.toString());

    if (Array.from(updatedItem as any).length !== 0) {
      await this.productController.putProductsByid(productId, updatedItem);
      // Update the product in the list so the view reflects the change
      // this.productsList[index] = { ...this.productsList[index], ...this.flagCheck };
      this.editableItem = null;
      this.isEdit = false;
      this.productController.productsList = this.productsList;
    }
  }

  multipart(productImage: Event) {
    const input = (productImage.target as HTMLInputElement);
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      console.log(this.imageFile); // This should log the file object
    }
    if (!input) return;
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

  async enableEdit(id: number) {
    const index = this.productsList.findIndex(product => product.id === id);
    if (index === -1) return;
    if (this.isEdit) {
      let editedFlag = false;
      editedFlag = this.productsList[index].imageUrl !== this.flagCheck.imageUrl ||
        Number(this.productsList[index].price) !== Number(this.flagCheck.price) ||
        Number(this.productsList[index].stockQuantity) !== Number(this.flagCheck.stockQuantity) ||
        this.productsList[index].active !== this.flagCheck.active ||
        Number(this.productsList[index].discount) !== Number(this.flagCheck.discount);
      if (editedFlag) {
        const confirm = await this.notification.openWindow('confirm');
        if (confirm) {
          this.isEdit = false;
          this.editableItem = null;
          await this.updateProduct(this.productsList[index].id, true);
        } else {
          this.isEdit = false;
          this.editableItem = null;
          this.productsList[index] = this.flagCheck;
        }
      } else {
        this.isEdit = false;
        this.editableItem = null;
      }
    } else {
      this.isEdit = true;
      this.editableItem = id;
      this.flagCheck = { ...this.productsList[index] };
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
    if (input === 'price' || input === 'discount') regex = /^\d+(\.\d{0,2})?$/;

    if (inputValue !== '' && !regex.test(inputValue)) {
      event.target.value = inputValue.slice(0, -1);
    }
  }
}

