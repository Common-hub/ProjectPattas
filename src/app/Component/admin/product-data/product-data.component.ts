import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/models/user';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { SearchService } from 'src/app/Services/search.service';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.scss']
})
export class ProductDataComponent implements OnInit {

  isEdit: boolean = false;
  currentpage: number = 0;
  totalPages: number = 0;
  size: number = 0;
  editableItem: number | null = null;
  productsList: products[] = [];
  flagCheck!: products;
  pages: number[] = [];
  constructor(private apiInterAction: ApiInteractionService, private notification: SearchService) { }

  ngOnInit(): void {
    this.fetchProducts(0, 12);
  }

  updateProduct(index: number) {
    this.isEdit = false;
    this.editableItem = index;
    this.apiInterAction.putProducts(this.productsList[index].id, this.productsList[index]).subscribe(res => console.log(res))
  }

  changeSize(event: Event) {
    this.size = Number((event.target as HTMLInputElement).value)
    this.fetchProducts(this.currentpage, Number((event.target as HTMLInputElement).value));
  }

  async enableEdit(index: number) {
    if (this.isEdit) {
      var editedFlag = false;
      editedFlag = this.productsList[index].name !== this.flagCheck.name ||
        this.productsList[index].imageUrl !== this.flagCheck.imageUrl || this.productsList[index].price !== this.flagCheck.price ||
        this.productsList[index].stockQuantity !== this.flagCheck.stockQuantity || this.productsList[index].description !== this.flagCheck.description;
      if (editedFlag) {
        const confirm = await this.notification.open('alert')
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

  fetchProducts(page: number, size: number) {
    this.currentpage = page;
    this.apiInterAction.getProducts(page, size).subscribe(product => {
      this.productsList = product.content;
      this.totalPages = product.totalPages;
      page = product.number;
      this.notification.jobDone("fetch SuccessFul")
      this.updatepages();
    });
  }

  updatepages() {
    const range = 0;
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i)
    }
  }

  goToFirst() {
    this.fetchProducts(0, this.size)
  }

  goToLast() {
    this.fetchProducts(this.totalPages - 1, this.size)
  }
}
