import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { address, order } from 'src/app/models/user';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  userAddress: string[] = [];
  orders: order[] = [];
  isAdd: boolean = false;
  isOrder: boolean = true;
  isSpecorder: boolean = false;
  billingAdd: address = new address();
  shippingAdd: address = new address();

  addressForm!: FormGroup;

  constructor(private route: Router, private apiInteraction: ApiInteractionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      addressL1: ['', Validators.required],
      addressL2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      country: ['', Validators.required],
      //shiipping Address
      bAddressL1: ['', Validators.required],
      bAddressL2: ['', Validators.required],
      bCity: ['', Validators.required],
      bState: ['', Validators.required],
      bZip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      bCountry: ['', Validators.required]
    })
    this.apiInteraction.getOrder().subscribe((order: order[]) => {
      this.orders = order;
      console.log(order, this.orders);
    })
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['/productsList'])
  }

  getsubtotal(i: number) {
    return this.orders[i].items[i].product.price * this.orders[i].items[i].quantity;
  }

  showOrderStatus(i: number) {
    this.isOrder = false;
    this.isSpecorder = true;
  }

  sameAddress(iSame: boolean) {
    if (iSame) {
      this.addressForm.controls['bAddressL1'].setValue(this.addressForm.controls['addressL1'].value);
      this.addressForm.controls['bAddressL2'].setValue(this.addressForm.controls['addressL2'].value);
      this.addressForm.controls['bCountry'].setValue(this.addressForm.controls['country'].value);
      this.addressForm.controls['bState'].setValue(this.addressForm.controls['state'].value);
      this.addressForm.controls['bZip'].setValue(this.addressForm.controls['zip'].value);
      this.addressForm.controls['bCity'].setValue(this.addressForm.controls['city'].value);
    }else{
      this.addressForm.controls['bAddressL1'].setValue('');
      this.addressForm.controls['bAddressL2'].setValue('');
      this.addressForm.controls['bCountry'].setValue('');
      this.addressForm.controls['bState'].setValue('');
      this.addressForm.controls['bZip'].setValue('');
      this.addressForm.controls['bCity'].setValue('');
    }
  }

  screentoggle(screen: string) {
    switch (screen) {
      case 'address':
        this.isAdd = true;
        this.isOrder = false;
        this.isSpecorder = false;
        break;
      case 'Orders':
        this.isOrder = true;
        this.isAdd = false;
        this.isSpecorder = false;
    }
  }

}
