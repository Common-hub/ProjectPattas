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

  constructor(private apiInterceptor: ApiInteractionService) { }

  ngOnInit(): void {
    this.apiInterceptor.getOrder().subscribe(res => {
      console.log(res);
      this.orders = res      
    })
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

    const mark = environment.logo;
    
    let y = 15;
    bill.setFontSize(24);
    bill.addImage(mark, 'PNG', 10, y-10, 15, 15)
    bill.text(shopeName, bill.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 10;
    bill.setFontSize(12);
    bill.text(`Address: ${ShopAddress}`, bill.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y+=6;
    bill.text(`phone: ${shopPhone}`, bill.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y+=6;
    bill.text(`mail: ${shopMail}`, bill.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y+=10;
    bill.setFont('helvetica', 'normal');
    bill.text(`Name: ${CustomerName}`,10, y)
    bill.text(`Phone: ${customerPhone}`,130, y)
    y+=10;
    bill.text(`Mail: ${customerMail}`,10, y)
    y +=6;
    bill.text(`Billing Address: ${customerBilling}`,10,y);
    y +=6;
    bill.text(`shipping Address: ${customerShopping}`,10,y);
    y+=10;
    bill.setFont('helvetica', 'bold');
    bill.text(`Order Id: ${orderId}`, 10, y);
    bill.text(`Bill No: ${billNo}`, 140, y);
    y+=10;
    const product = this.orders[i].orderItemDto;
    const table = product.map((order: any)=>[
      order.colum1,
    ])
    autoTable(bill,{
      head: [['ItemName', 'Qty', 'Rate', 'Total']],
      body: table,
      startY: y
    })
    //previewPdf
    const blob = bill.output('blob');
    this.pdfView = URL.createObjectURL(blob);
    window.open(this.pdfView, '_blank');
  }

}
