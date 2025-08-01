import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductController } from 'src/app/controller/productController.service';
import { UserControllerService } from 'src/app/controller/user-controller.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';

@Component({
  selector: 'app-add-crackers',
  templateUrl: './add-crackers.component.html',
  styleUrls: ['./add-crackers.component.css']
})
export class AddCrackersComponent implements OnInit {

  imageSrc: any = '';
  image!: File;
  index: number = 0;
  isUpdate: boolean = false;
  addProducts!: FormGroup;

  constructor(private fb: FormBuilder, private apiInteraction: UserControllerService, private notification: UserInteractionService, private productController: ProductController) {
    this.addProducts = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stockQuantity: ['', Validators.required],
      imageUrl: ['', Validators.required],
      discount: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  restrictText(event: any, input: string) {
    const inputValue = event.target.value.trim();

    var regex: RegExp = /^\d+$/;
    if (input === 'price' || input === 'discount') regex = /^\d+(\.\d{0,2})?$/;

    if (inputValue !== '' && !regex.test(inputValue)) {
      event.target.value = inputValue.slice(0, -1);
    }
  }

  previewImg(image: Event) {
    const input = (image.target as HTMLInputElement);
    if (input.files && input.files.length > 0) {
      this.image = input.files[0];
      console.log(this.image); // This should log the file object
    }
    if (!input) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc = reader.result as string
    };
    reader.readAsDataURL(this.image)
  }

  addProduct() {
    this.isUpdate = true;
    const addedProduct = new FormData();
    const price = parseFloat(this.addProducts.controls['price'].value).toFixed(2);
    addedProduct.append('name', this.addProducts.controls['name'].value);
    addedProduct.append('description', this.addProducts.controls['description'].value);
    addedProduct.append('price', price);
    addedProduct.append('stockQuantity', this.addProducts.controls['stockQuantity'].value);
    addedProduct.append('image', this.image);
    addedProduct.append('discount', this.addProducts.controls['discount'].value ?? '0');
    addedProduct.append('active', true.toString());

    this.productController.postProduct(addedProduct).subscribe(success => {
      if (success) {
        this.imageSrc = "";
        this.addProducts.reset();
      }
    });
  }

}
