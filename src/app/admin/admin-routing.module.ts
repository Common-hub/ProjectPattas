import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDataComponent } from './Component/product-data/product-data.component';
import { AddCrackersComponent } from './Component/add-crackers/add-crackers.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { AuthGuardGuard } from '../Services/auth-guard.guard';

const routes: Routes = [
  { path: 'productsList', component: ProductDataComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'], public: false } },
  { path: 'addProducts', component: AddCrackersComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'], public: false } },
  { path: 'dashBoard', component: DashboardComponent, canActivate: [AuthGuardGuard], data: { roles: ['admin'], public: false } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
