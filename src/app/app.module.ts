import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './Component/login-component/login-component.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './Component/user/product-component/product-component.component';
import { MyInterceptorInterceptor } from './interceptors/my-interceptor.interceptor';
import { HeaderComponent } from './Component/header/header.component';
import { AddCrackersComponent } from './Component/admin/add-crackers/add-crackers.component';
import { KartItemsComponent } from './Component/user/kart-items/kart-items.component';
import { AlertWindowComponent } from './Component/alert-window/alert-window.component';
import { DashboardComponent } from './Component/admin/dashboard/dashboard.component';
import { OrderDetailsComponent } from './Component/user/order-details/order-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    ProductComponent,
    HeaderComponent,
    AddCrackersComponent,
    KartItemsComponent,
    AlertWindowComponent,
    OrderDetailsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: MyInterceptorInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
