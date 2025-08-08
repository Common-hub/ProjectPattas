import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserControllerService } from 'src/app/controller/user-controller.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';
import { address, Order, ORDER_STATUS_VALUES, OrderStatus, userDetails } from 'src/app/shared/models';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  userAddress: string[] = [];
  orders: Order[] = [];
  specOrders: any[] = [];
  orderStatus: OrderStatus[] = ORDER_STATUS_VALUES;
  userdetails: userDetails = {} as userDetails;
  name: { fName: string, lName: string } = { fName: '', lName: '' };
  isAdd: boolean = false;
  isOrder: boolean = true;
  isSpecorder: boolean = false;
  placeOrder: boolean = true;
  billingAdd!: address;
  shippingAdd!: address;
  addressForm!: FormGroup;
  totalPrice: number = 0;
  selectedOrderId: number = 0;

  constructor(private route: Router, private apiInteraction: UserControllerService, private fb: FormBuilder, private details: UserControllerService, private notify: UserInteractionService) { }

  ngOnInit(): void {
    const order = localStorage.getItem('ordered');
    this.placeOrder = order != undefined ? order === 'false' ? false : true : false;

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

    if (this.details.$addressFound) {
      this.isAdd = true;
      this.isOrder = false;
    }

    this.details.$UserDetail.subscribe(response => {
      this.userdetails = response;
      const userName = response && response.name.split(" ");
      this.name = { fName: userName[0], lName: userName[1] }
    })

    this.apiInteraction.getOrder().subscribe((order: Order[]) => {
      if (order.length >= 1) {
        this.orders = order;
      }
    },
      (error) => {
        this.notify.sppError(error.error[0])
      })
  }

  logout() {
    sessionStorage.clear();
    this.route.navigate(['/productsList'])
  }

  showOrderStatus(i: number) {
    this.isOrder = false;
    this.isSpecorder = true;
    this.specOrders = this.orders[i].orderItemDto;
    this.selectedOrderId = this.orders[i].orderId;
    this.getTotal(i)
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

  confirmOrder() {
    this.notify.sppInfo("Address Saved Succesful 👍");
    this.addressForm.reset();
    if (this.placeOrder) {
      const address = this.addressForm.controls['addressL1'].value + '+' + this.addressForm.controls['addressL2'].value + '+' +
        this.addressForm.controls['country'].value + '+' + this.addressForm.controls['state'].value + '+' +
        this.addressForm.controls['zip'].value + '+' + this.addressForm.controls['city'].value + '+'

      this.apiInteraction.postOrder(address).subscribe(resp => {
        this.notify.sppInfo(resp);
        this.isAdd = false;
        this.isOrder = true;
        localStorage.setItem('ordered', this.placeOrder.toString())
      })
    }
    this.addressForm.reset();
  }

  getCurrentState() {
    const index = this.orderStatus.findIndex((status) => status === this.orders[0].status);
    return ['shipped', 'delivered', 'cancelled', 'returned', 'refunded'].includes(this.orders[0].status?.toLowerCase()) ? [this.orders[0].status] :
      index === 0 ? [this.orders[0].status] : this.orderStatus.slice(0, index);
  }

  getTotal(index: number) {
    this.totalPrice = 0;
    this.orders[index].orderItemDto.forEach(products => {
      this.totalPrice += products.price;
    });
    return this.totalPrice;
  }

  downloadInvoice() {
    this.apiInteraction.getInvoice(this.selectedOrderId).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // To open in new tab:
      window.open(url);

      // OR to trigger download:
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${this.selectedOrderId}.pdf`;
      a.click();

      // Cleanup
      URL.revokeObjectURL(url);
    });

  }
}
