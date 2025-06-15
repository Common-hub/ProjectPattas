import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ApiInteractionService } from 'src/app/Services/api-interaction.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errorMsg: string = "";
  type: string = "Warning";
  pdfView: string = "";
  orders: any[] = [];
  unfilteredOrders: any[] = [];
  statuses: { value: string, option: string }[] = [{ value: 'PLACED', option: 'PLACED' }, { value: 'CONFIRMED', option: 'CONFIRMED' }, { value: 'PROCESSING', option: 'PROCESSING' }, { value: 'SHIPPED', option: 'SHIPPED' }, { value: 'DELIVERED', option: 'DELIVERED' }, { value: 'CANCELLED', option: 'CANCELLED' }, { value: 'RETURNED', option: 'RETURNED' }, { value: 'REFUNDED', option: 'REFUNDED' }, { value: 'FAILED', option: 'FAILED' }]
  pendingOrders: number = 0;
  completeOrders: number = 0;

  constructor(private apiInterceptor: ApiInteractionService) { }

  ngOnInit(): void {
    this.apiInterceptor.getOrder().subscribe(res => {
      console.log(res);

      this.orders = res;
      this.unfilteredOrders = this.orders;
      this.completeOrders = this.orders.filter(order => order.status === 'DELIVERED').length
      this.pendingOrders = this.orders.filter(order => order.status.toLowerCase() === 'PLACED' || 'PROCESSING' || 'SHIPPED').length
    })
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

  exportToPdf(i: number) {
    const bill = new jsPDF();

    const shopeName = 'Suriya Pryo Park';
    const shopPhone = '';
    const shopMail = '';
    const ShopAddress = "";
    //
    const CustomerName = 'Suriya Pryo Park';
    const customerMail = "";
    const customerPhone = '';
    const customerBilling = '';
    const customerShopping = "";
    //
    const billNo = '';
    const orderId = this.orders[i].orderId;
    //
    var total = 0;
    const mark = environment.logo;

    let currentY = 15;
    bill.setFontSize(24);
    bill.addImage(mark, 'PNG', 10, currentY - 10, 15, 15)
    bill.text(shopeName, bill.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 10;
    bill.setFontSize(12);
    bill.text(`Address: ${ShopAddress}`, bill.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 6;
    bill.text(`phone: ${shopPhone}`, bill.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 6;
    bill.text(`mail: ${shopMail}`, bill.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 10;
    bill.setFont('helvetica', 'normal');
    bill.text(`Name: ${CustomerName}`, 10, currentY)
    bill.text(`Phone: ${customerPhone}`, 130, currentY)
    currentY += 10;
    bill.text(`Mail: ${customerMail}`, 10, currentY)
    currentY += 6;
    bill.text(`Billing Address: ${customerBilling}`, 10, currentY);
    currentY += 6;
    bill.text(`shipping Address: ${customerShopping}`, 10, currentY);
    currentY += 10;
    bill.setFont('helvetica', 'bold');
    bill.text(`Order Id: ${orderId}`, 10, currentY);
    bill.text(`Bill No: ${billNo}`, 140, currentY);
    currentY += 10;
    const product = this.orders[i].orderItemDto;

    const table = product.map((order: any) => [
      order.product.name,
      order.quantity,
      order.product.price,
      order.quantity * order.product.price
    ])

    autoTable(bill, {
      head: [['ItemName', 'Qty', 'Rate', 'Total']],
      body: table,
      startY: currentY,
      didDrawPage: (data) => {
        if (data.cursor && typeof data.cursor.y === 'number')
          currentY = (data.cursor.y)
      }
    })

    this.orders[i].orderItemDto.forEach((order: any) => {
      total += order.quantity * order.product.price;
    });

    currentY = (typeof currentY === 'number' ? currentY : 80) + 10;
    bill.setFont('helvetica', 'bold');
    bill.text(`Total: RS. ${total.toFixed(2)} /-`, 155, currentY, { align: 'right' });
    currentY += 5;
    bill.setFont('helvetica', 'normal');
    bill.text('Thank You for Shopping Here.', bill.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    //previewPdf
    const blob = bill.output('blob');
    this.pdfView = URL.createObjectURL(blob);
    window.open(this.pdfView, '_blank');
  }

}
