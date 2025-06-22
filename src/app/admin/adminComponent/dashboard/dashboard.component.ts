import { Component, OnInit } from '@angular/core';
import { Order, ORDER_STATUS_VALUES, OrderAdmin, OrderStatus } from 'src/app/models';
import { AuthorizeService } from 'src/app/Services/authorize.service';
import { OrderController } from 'src/app/Services/orderController.service';

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
  completeOrders : number = 0;

  constructor(public orderController: OrderController, private authenticate: AuthorizeService) { }

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
}
