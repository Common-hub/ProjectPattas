import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { ProductHandlerService } from 'src/app/Services/producthandler.service';
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
  productsList: Product[] = [];
  flagCheck!: Product;
  pages: number[] = [];
  constructor(private apiInterAction: ApiInteractionService, private notification: SearchService, public productHandler: ProductHandlerService) { }

  ngOnInit(): void {
   this.productHandler.isFetched ? '' : this.productHandler.fetchProducts(0, 15);
   this.productHandler.putProductsByid(12)
  }

  updateProduct(index: number) {
    this.isEdit = false;
    this.editableItem = index;
    this.apiInterAction.putProducts(this.productsList[index].id, this.productsList[index]).subscribe(res => console.log(res))
  }

  changeSize(event: Event) {
    this.size = Number((event.target as HTMLInputElement).value);
    this.productHandler.setPageSize(this.size);
  }

  deleteProduct(id:number){
    this.productHandler.deleteProduct(id);
  }

  async enableEdit(index: number) {
    if (this.isEdit) {
      var editedFlag = false;
      editedFlag = this.productsList[index].name !== this.flagCheck.name ||
        this.productsList[index].image !== this.flagCheck.image || this.productsList[index].price !== this.flagCheck.price ||
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

  updatepages() {
    const range = 0;
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i)
    }
  }

  changePage(page: number){
    this.productHandler.setCurrentPage(page)
  }

  goToFirst() {
    this.productHandler.setCurrentPage(0);
    this.productHandler.setPageSize(this.size);
  }

  goToLast() {
    this.productHandler.setCurrentPage(this.totalPages - 1);
    this.productHandler.setPageSize(this.size);
  }
}
