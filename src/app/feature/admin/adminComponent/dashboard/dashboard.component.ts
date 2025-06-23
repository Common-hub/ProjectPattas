import { Component, OnInit } from '@angular/core';
import { Order, ORDER_STATUS_VALUES, OrderAdmin, OrderStatus, updateOrder } from 'src/app/shared/models';
import { AuthorizeService } from 'src/app/core/gaurdds/authorize.service';
import { OrderController } from 'src/app/controller/orderController.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  orderList: OrderAdmin[] = [];
  orderStatus: OrderStatus[] = ORDER_STATUS_VALUES;
  editedOrderItem: OrderAdmin = {} as OrderAdmin;
  pendingOrders: number = 0;
  completeOrders: number = 0;
  isEditable: number | null = null
  backUp!: OrderAdmin
  isEdit: boolean = false;
  iserror: boolean = false;
  inprocess: boolean = false;
  isUpdated: boolean = false;

  constructor(public orderController: OrderController, private authenticate: AuthorizeService, private notify: UserInteractionService) { }

  ngOnInit(): void {
    this.orderController.fetchAdminOrders();
    this.orderController.$adminOrders.subscribe(order => {
      this.orderList = order;
      this.completeOrders = this.orderList.filter(order => order.orderStatus === 'DELIVERED').length
      this.pendingOrders = this.orderList.filter(order => order.orderStatus.toLowerCase() === 'PLACED' || 'PROCESSING' || 'SHIPPED').length
    })
  }

  getStatus(status: any) {
    if (['PLACED', 'CONFIRMED', 'PROCESING', 'SHIPPED'].includes(status)) {
      return 'badge-warning';
    }
    else if (['CANCELLED', 'RETURNED', 'REFUNDED', 'FAILED'].includes(status)) {
      return 'badge-danger';
    }
    else {
      return 'badge-success';
    }
  }

  filter(type: string) {
    this.orderList = this.orderList.filter(order => order.orderStatus.toLowerCase() === type)
    this.orderController.adminOrders = this.orderList;
  }

  onStatusChange(status: string) {
    alert(this.orderList[0].orderStatus)
  }

  sortProducts(type: keyof OrderAdmin, ascending: boolean = false): void {
    this.orderList.sort((a, b) => {
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
    this.orderController.adminOrders = this.orderList;
  }

  editStatus(orderId: number) {
    console.log(this.isEdit);
    const index = this.orderList.findIndex(i => i.id === orderId);
    if (this.isEditable === orderId) { } else {
      this.isEditable = orderId;
      this.backUp = JSON.parse(JSON.stringify({ ...this.orderList[index] }));
      console.log(JSON.stringify(this.orderList[index]) === JSON.stringify(this.backUp));
    }
  }

  updateStatus(orderId: number) {
    const index = this.orderList.findIndex(i => i.id === orderId);
    if (this.isEditable === orderId) {
      const invalidStatus = this.orderList[index].orderStatus === 'SHIPPED';
      const emptyFields = !this.orderList[index].trackingId || !this.orderList[index].logisticsPartner;
      this.iserror = invalidStatus && emptyFields;
      console.log(this.iserror)
      if (!this.iserror) {
        const noChanges = JSON.stringify(this.orderList[index]) === JSON.stringify(this.backUp) ? true : false;
        if (noChanges) {
          this.notify.sppWarning("Detected No Changes.⁉");
        } else {
          this.inprocess = true;
          const uplodedItem: updateOrder = { orderId: this.orderList[index].id, orderStatus: this.orderList[index].orderStatus, trackingId: this.orderList[index].trackingId }
          this.orderController.updateOrderItem(uplodedItem);
          setTimeout(() => {
            this.inprocess = this.orderController.flageOff;
          }, 2000);
        }
      }
    }
  }
}
