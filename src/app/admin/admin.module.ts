import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCrackersComponent } from './adminComponent/add-crackers/add-crackers.component';
import { DashboardComponent } from './adminComponent/dashboard/dashboard.component';
import { ProductDataComponent } from './adminComponent/product-data/product-data.component';


@NgModule({
  declarations: [
    AddCrackersComponent,
    DashboardComponent,
    ProductDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule]
})
export class AdminModule { }
