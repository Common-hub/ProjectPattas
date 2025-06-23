import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserControllerService } from 'src/app/controller/user-controller.service';
import { address, Order, ORDER_STATUS_VALUES, OrderStatus } from 'src/app/shared/models';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  userAddress: string[] = [];
  orders: Order[] = [];
  orderStatus: OrderStatus[] = ORDER_STATUS_VALUES;
  userDetails: any = '';
  name: {fName: string, lName:string} = {fName: '', lName: ''};
  isAdd: boolean = false;
  isOrder: boolean = true;
  isSpecorder: boolean = false;
  billingAdd!: address;
  shippingAdd!: address;

  addressForm!: FormGroup;

  constructor(private route: Router, private apiInteraction: UserControllerService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      addressL1: ['', Validators.required],
      addressL2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      country: ['', Validators.required],
      //shiipping Address
      // bAddressL1: ['', Validators.required],
      // bAddressL2: ['', Validators.required],
      // bCity: ['', Validators.required],
      // bState: ['', Validators.required],
      // bZip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      // bCountry: ['', Validators.required]
    })

    if (sessionStorage.getItem('address') === 'true') {
      this.isAdd = true;
      this.isOrder = false;
    }
    this.apiInteraction.getUser().subscribe(user=>{
      this.userDetails = user;
      var names = this.userDetails.name.split(' ');
      this.name = {fName: names[0], lName: names[1] ? names[1] : '--'};
      console.log(this.userDetails);
      
    })

    this.apiInteraction.getOrder().subscribe((order: Order[]) => {
      this.orders = order;
      console.log(order, this.orders[0].status);
    })
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['/productsList'])
  }

  getsubtotal(i: number) {
    return this.orders[i].products[i].price * this.orders[i].products[i].orderedQuantity;
  }

  showOrderStatus(i: number) {
    this.isOrder = false;
    this.isSpecorder = true;
  }

  // sameAddress(iSame: boolean) {
  //   if (iSame) {
  //     this.addressForm.controls['bAddressL1'].setValue(this.addressForm.controls['addressL1'].value);
  //     this.addressForm.controls['bAddressL2'].setValue(this.addressForm.controls['addressL2'].value);
  //     this.addressForm.controls['bCountry'].setValue(this.addressForm.controls['country'].value);
  //     this.addressForm.controls['bState'].setValue(this.addressForm.controls['state'].value);
  //     this.addressForm.controls['bZip'].setValue(this.addressForm.controls['zip'].value);
  //     this.addressForm.controls['bCity'].setValue(this.addressForm.controls['city'].value);
  //   }else{
  //     this.addressForm.controls['bAddressL1'].setValue('');
  //     this.addressForm.controls['bAddressL2'].setValue('');
  //     this.addressForm.controls['bCountry'].setValue('');
  //     this.addressForm.controls['bState'].setValue('');
  //     this.addressForm.controls['bZip'].setValue('');
  //     this.addressForm.controls['bCity'].setValue('');
  //   }
  // }

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

  confirmOrder(){
    const address = this.addressForm.controls['addressL1'].value +','+ this.addressForm.controls['addressL2'].value +','+
    this.addressForm.controls['country'].value +','+ this.addressForm.controls['state'].value +','+
    this.addressForm.controls['zip'].value +','+ this.addressForm.controls['city'].value +','

    this.apiInteraction.postOrder(address).subscribe(resp=>{
      console.log(resp);
      this.isAdd = false;
      this.isOrder = true;      
    })
  }

  getCurrentState(){    
      const index = this.orderStatus.findIndex((status) => status === this.orders[0].status);
      console.log(index);
      
    return index !== -1 ? index : 0; // Return 0 if status not foun
  }
}
