import { Component, OnInit } from '@angular/core';
import { OrderController } from 'src/app/controller/orderController.service';
import { AuthorizeService } from 'src/app/core/guard/authorize.service';
import { UserInteractionService } from 'src/app/core/service/user-interaction.service';
import { ORDER_STATUS_VALUES, OrderAdmin, OrderStatus, updateOrder } from 'src/app/shared/models';

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
  totalOrders: number = 0;
  isEditable: number | null = null
  backUp!: OrderAdmin
  isEdit: boolean = false;
  iserror: boolean = false;
  inprocess: boolean = false;
  status!: OrderStatus;

  constructor(public orderController: OrderController, private authenticate: AuthorizeService, private notify: UserInteractionService) { }

  ngOnInit(): void {
    this.orderController.fetchAdminOrders();
    this.orderController.$adminOrders.subscribe(order => {
      this.orderList = order;
      this.completeOrders = this.orderList.filter(order => order.orderStatus === 'DELIVERED').length;
      this.pendingOrders = this.orderList.filter(order => ['PLACED', 'CONFIRMED', 'PROCESING', 'SHIPPED'].includes(order.orderStatus.toUpperCase())).length;
      this.totalOrders = this.orderList.length;
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

  // filter(type: string) {
  //   this.orderList = this.orderList.filter(order => order.orderStatus.toLowerCase() === type)
  //   this.orderController.adminOrders = this.orderList;
  //   this.orderController.$adminOrders.subscribe(order => {
  //   this.orderList = order;
  //     this.completeOrders = this.orderList.filter(order => order.orderStatus === 'DELIVERED').length
  //     this.pendingOrders = this.orderList.filter(order => ['PLACED', 'PROCESSING', 'SHIPPED'].includes(order.orderStatus.toLowerCase())).length
  //   })
  // }

  onStatusUpdate(status: string): string[] {
    const index = this.orderStatus.findIndex(x => x === status);
    return this.orderStatus.slice(index)
  }

  onStatusChange(): boolean {
    return ['shipped', 'delivered'].includes(this.status?.toLowerCase()) ? true : false;
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
    const index = this.orderList.findIndex(i => i.id === orderId);
    if (this.isEditable !== null) {
      this.notify.sppWarning("Update the selected Item first!!");
    } else if (this.isEditable === orderId) {
    } else {
      this.isEditable = orderId;
      this.backUp = JSON.parse(JSON.stringify({ ...this.orderList[index] }));
    }
  }

  updateStatus(orderId: number) {
    const index = this.orderList.findIndex(i => i.id === orderId);
    if (this.isEditable === orderId) {
      this.orderList[index].orderStatus = this.status;
      const invalidStatus = this.orderList[index].orderStatus === 'SHIPPED' || this.orderList[index].orderStatus === 'DELIVERED';
      const emptyFields = !this.orderList[index].trackingId || !this.orderList[index].logisticsPartner;
      this.iserror = invalidStatus && emptyFields;
      if (this.iserror) {
        this.notify.sppWarning("Please fill both Logistics partner and Tracking ID fields when Shipping.");
        this.onStatusChange();
      } else {
        const noChanges = JSON.stringify(this.orderList[index]) === JSON.stringify(this.backUp) ? true : false;
        if (noChanges) {
          this.notify.sppWarning("Detected No Changes.⁉");
        } else {
          this.inprocess = true;
          const tracker = this.orderList[index].trackingId !== null ? this.orderList[index].trackingId : '';
          const uplodedItem: updateOrder = { id: this.orderList[index].id, orderStatus: this.orderList[index].orderStatus, trackingId: tracker, logistictsPartner: this.orderList[index].logisticsPartner }
          this.orderController.updateOrderItem(uplodedItem);
          setTimeout(() => {
            this.inprocess = this.orderController.flageOff;
          }, 2000);
          this.isEdit = false;
          this.isEditable = null;
        }
      }
    }
  }
}
