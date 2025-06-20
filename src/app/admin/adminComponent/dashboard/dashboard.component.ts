import { Component, OnInit } from '@angular/core';
import { ORDER_STATUS_VALUES, OrderStatus } from 'src/app/models';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { UserInteractionService } from 'src/app/Services/user-interaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errorMsg: string = "";
  type: string = "Warning";
  pdfView: string = "";
  tracker: string = "";
  partner: string = "";
  orders: any[] = [];
  updatedOrder: any[] = [];
  originalState: any[] = [];
  unfilteredOrders: any[] = [];
  statuses: OrderStatus[] = ORDER_STATUS_VALUES; 
  pendingOrders: number = 0;
  completeOrders: number = 0;
  updatedItem: number | null = null;
  isUpdate: boolean = true;

  constructor(private apiInterceptor: ApiInteractionService, private notification: UserInteractionService) { }

  ngOnInit(): void {
    this.apiInterceptor.getOrder().subscribe(res => {
      this.orders = res;
      this.unfilteredOrders = this.orders;
      this.notification.jobDone("Owners Dashboard loaded Succesfully")
      this.completeOrders = this.orders.filter(order => order.status === 'DELIVERED').length
      this.pendingOrders = this.orders.filter(order => order.status.toLowerCase() === 'PLACED' || 'PROCESSING' || 'SHIPPED').length
    },
      (error) => {
        this.notification.jobError(error.error)
      })
  }

  updatePartner(partner: Event, i: number) {
    this.partner = (partner.target as HTMLInputElement).value;
    if ((partner.target as HTMLInputElement).value !== '') this.orders[i].partner = (partner.target as HTMLInputElement).value
  }

  updateTracker(tracker: Event, i: number) {
    this.tracker = (tracker.target as HTMLInputElement).value;
    if ((tracker.target as HTMLInputElement).value !== '') this.orders[i].tracker = (tracker.target as HTMLInputElement).value
  }

  updatedStatus(status: Event, order: any, i: number) {
    const changeIndex = this.originalState.length > 0 ? this.originalState.findIndex(state => state.id === order.id) : -1;
    if (changeIndex < 0) {
      if (order.status !== status) {
        this.tracker = order.tracker;
        this.partner = order.partner;
        this.updatedItem = i;
        this.originalState.push({ id: order.id, previousState: order.status, newState: status, ogIndex: i });
        this.updatedOrder.push(this.orders[i]);
      } else {
        this.updatedItem = null;
        this.tracker = "";
        this.partner = "";
      }
    } else {
      const updateIndex = this.updatedOrder.findIndex(update => update.id === this.originalState[changeIndex].id);
      this.tracker = order.tracker;
      this.partner = order.partner;
      if (status === this.originalState[changeIndex].previousState) {
        this.updatedItem = null;
        this.orders[i].status = this.originalState[changeIndex].previousState;
        this.originalState.splice(changeIndex, 1);
        this.updatedOrder.splice(updateIndex, 1);
        console.log("updatedState", this.updatedOrder, "changedStatus", this.originalState);
      } else if (status !== this.originalState[changeIndex].previousState) {
        this.originalState[changeIndex].newState = status;
        this.updatedOrder[updateIndex].status = this.originalState[changeIndex].newState;
        console.log("updatedState", this.updatedOrder, "changedStatus", this.originalState);
      }
    }
  }
  updateOrders(index: number) {
    if (this.orders[index].status === 'SHIPPED' && (this.orders[index].tracker !== undefined && this.orders[index].partner !== undefined)) {
      this.updatedItem = null;
      this.tracker = "";
      this.partner = "";
      console.log("tracker", this.orders[index].tracker, "partner", this.orders[index].partner);
    }
  }

  filter(type: string) {
    this.orders = this.unfilteredOrders
    this.orders = this.orders.filter(order => order.status.toLowerCase() === type)
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

  downloadBill(index: number) {
    this.apiInterceptor.getInvoice(this.orders[index].orderId).subscribe(invoice => {
    const bill = new Blob([invoice], {type: 'application/pdf'});
    const url = window.URL.createObjectURL(invoice);
    const button = document.createElement('a');
    button.href = url;
    button.download = "Invoice-"+this.orders[index].orderId;
    button.style.display = 'none';
    document.body.appendChild(button);
    button.click();
    document.body.removeChild(button);
    window.URL.revokeObjectURL(invoice);
    })
  }

}
