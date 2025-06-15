import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { products } from 'src/app/models/user';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';

@Component({
  selector: 'app-add-crackers',
  templateUrl: './add-crackers.component.html',
  styleUrls: ['./add-crackers.component.css']
})
export class AddCrackersComponent implements OnInit {

  imageSrc: any = '';
  product: products[] = [];
  image: any = '';
  index: number = 0;
  isUpdate: boolean = false;
  addProducts!: FormGroup;

  constructor(private fb: FormBuilder, private apiInteraction: ApiInteractionService) {
    this.addProducts = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stockQuantity: ['', Validators.required],
      imageUrl: ['', Validators.required ]
    })
  }

  ngOnInit(): void {
  }

  previewImg(image: any) {
    const file = image.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file)
    }
  }

  addProduct() {
    const addedProduct = {
      id: '',
      name: this.addProducts.controls['name'].value,
      description: this.addProducts.controls['description'].value,
      price: this.addProducts.controls['price'].value,
      imageUrl: this.imageSrc,
      stockQuantity: this.addProducts.controls['stockQuantity'].value
    }
    this.product.push(addedProduct);
    this.addProducts.reset();
    this.imageSrc = '';  
  }

  updateItem(index: number) {
    this.index = index;
    this.isUpdate = true
    this.addProducts.patchValue({
      name: this.product[index].name,
      description: this.product[index].description,
      price: this.product[index].price,
      stockQuantity: this.product[index].stockQuantity
    });
    this.imageSrc = this.product[index].imageUrl
    this.addProducts.controls['imageUrl'].clearValidators();
    this.addProducts.controls['imageUrl'].updateValueAndValidity();    
  }

  deleteItem(index: number){
    this.product.splice(index,1);
  }

  updateProducts(){
    this.apiInteraction.addproducts(this.product).subscribe((res:any)=>console.log(res))
  }

  update(){
     const updatedProduct = {
      id: '',
      name: this.addProducts.controls['name'].value,
      description: this.addProducts.controls['description'].value,
      price: this.addProducts.controls['price'].value,
      imageUrl: this.image,
      stockQuantity: this.addProducts.controls['stockQuantity'].value
    }
    this.product[this.index] = updatedProduct;
    this.addProducts.reset();
    this.isUpdate = false;  
  }

  uploadImg(event: any) {
    this.image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', this.image);
    formData.append('ProductName', '');
  }
}
