import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order, OrderAdmin, updateOrder } from '../shared/models';
import { HttpClient } from '@angular/common/http';
import { UserInteractionService } from '../core/service/user-interaction.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderController {

  private apiBaseUrl = environment.apiBaseUrl + "order";
  flageOff:boolean = true;

  unfilteredOrderAd: OrderAdmin[] = [];
  unfilteredOrder: Order[] = [];

  private orderItemsList = new BehaviorSubject<Order[]>([]);
  private adminOrderList = new BehaviorSubject<OrderAdmin[]>([]);

  $OrderItemsList = this.orderItemsList.asObservable();
  $AdminOrderList = this.adminOrderList.asObservable();

  constructor(private http: HttpClient, private loader: UserInteractionService, private router: Router) { }

  fetchOrders() {
    console.info('[Gaurd]:  Fetching the Orders Recived...');
    this.loader.showLoader();
    this.orderController.getOrders().pipe(tap(orders => {
      // this.ordersList = orders;
      this.unfilteredOrder = orders;
      this.loader.sppInfo('Orders Fetch SuccessFul 👍.');
    }), catchError(error => {
      this.loader.sppError('❌ ' + error.error);
      // this.clearOrders();
      console.error('[Products] productFetch Failed!....');
      return of([]);
    }),
      finalize(() => { this.loader.hideLoader(); })).subscribe();
  }

  fetchAdminOrders() {
    console.info('[Gaurd]:  Fetching the Orders Recived...');
    this.loader.showLoader();
    this.orderController.getAllOrders().pipe(tap(orderResp => {
      console.log(orderResp)
      this.unfilteredOrderAd = orderResp;
      this.adminOrders = orderResp;
      this.loader.sppInfo('Orders Fetch SuccessFul 👍.');
    }), catchError(error => {
      this.loader.sppError('❌ ' + error.error);
      // this.clearOrders();
      console.error('[Products] productFetch Failed!....');
      return of([]);
    }),
      finalize(() => { this.loader.hideLoader(); })).subscribe();
  }

  orderInit(address: string) {
    console.info("[Gaurd]: Placing Order initzated...");
    this.loader.showLoader();
    this.orderController.placeOrder(address).pipe(tap(response => {
      this.loader.sppInfo("✔ Order Placed Sucesfully 👍.");
      this.router.navigate(['user/orderStatus']);
    }), catchError(error => {
      this.loader.sppError('❌ ' + error.error);
      console.error('[Products] order Placement Failed!....');
      return of([]);
    }),
      finalize(() => { this.loader.hideLoader(); })).subscribe();
  }

  billInvoice(orderId: number) {
    console.info("[Gaurd]: Getting your Invoice");
    this.loader.showLoader();
    this.orderController.downloadInvoice(orderId).pipe(tap(billDetails => {
      const bill = new Blob([billDetails[0]], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(bill);
      const button = document.createElement('a');
      button.href = url;
      const index = this.adminOrders.findIndex(order => order.id === orderId)
      button.download = "Invoice-" + this.adminOrders[index].id;
      button.style.display = 'none';
      document.body.appendChild(button);
      button.click();
      document.body.removeChild(button);
      window.URL.revokeObjectURL(billDetails[0]);
      console.info("[Gaurd]:AllDone...");
      this.loader.sppInfo(billDetails[0]);
    }), catchError(error => {
      this.loader.sppError('❌ ' + error.error);
      console.info('[Products] Failed to generate invoice!....');
      return of([]);
    }),
      finalize(() => { this.loader.hideLoader(); })).subscribe();
  }

  // public set ordersList(orders: Order[]) {
  //   this.orderItemsList.next(orders);
  // }

  // public get ordersList(): Observable<Order[]> {
  //   return this.$OrderItemsList;
  // }

  updateOrderItem(orderItem: updateOrder) {
    console.info("[Guard]:updating orders....")
    this.orderController.updateStatus(orderItem).pipe(tap(response => {
      this.loader.sppInfo(response);
      console.info("[guard]:")
      this.fetchAdminOrders();
      this.flageOff = false
    }), catchError(error => {
      this.loader.sppError('❌ ' + error.error);
      console.error('[guard] updated order status failed');
      return of([]);
    }),
      finalize(() => { this.loader.hideLoader(); })).subscribe();
  }

  public set adminOrders(orders: OrderAdmin[]) {
    this.adminOrderList.next(orders);
  }


  public get $adminOrders(): Observable<OrderAdmin[]> {
    return this.$AdminOrderList;
  }

  // clearOrders() {
  //   this.ordersList = [];
  // }

  private orderController = {
    placeOrder: (userAddress: string): Observable<Order[]> => this.http.post<Order[]>(this.apiBaseUrl + '/place', userAddress, { responseType: 'json' }),
    getOrders: (): Observable<Order[]> => this.http.get<Order[]>(this.apiBaseUrl, { responseType: 'json' }),
    downloadInvoice: (orderId: number): Observable<string[]> => this.http.get<string[]>(this.apiBaseUrl + `order/${orderId}/invoice`),
    getAllOrders: (): Observable<OrderAdmin[]> => this.http.get<OrderAdmin[]>(this.apiBaseUrl + '/allOrders'),
    updateStatus: (status: updateOrder) => this.http.put<string>(this.apiBaseUrl + '/update', status)
  }
}
