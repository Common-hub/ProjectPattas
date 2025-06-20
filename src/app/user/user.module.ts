import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KartItemsComponent } from './userComponents/kart-items/kart-items.component';
import { OrderDetailsComponent } from './userComponents/order-details/order-details.component';
import { ProductComponent } from './userComponents/product-component/product-component.component';


@NgModule({
  declarations: [
    KartItemsComponent,
    OrderDetailsComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
