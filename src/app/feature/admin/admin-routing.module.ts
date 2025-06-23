import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDataComponent } from './adminComponent/product-data/product-data.component';
import { AddCrackersComponent } from './adminComponent/add-crackers/add-crackers.component';
import { DashboardComponent } from './adminComponent/dashboard/dashboard.component';
import { AuthGuardGuard } from '../core/gaurdds/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashBoard', pathMatch: 'full' },
  { path: 'productsList', component: ProductDataComponent, canActivate: [AuthGuardGuard], data: { roles: 'admin', public: false } },
  { path: 'addProducts', component: AddCrackersComponent, canActivate: [AuthGuardGuard], data: { roles: 'admin', public: false } },
  { path: 'dashBoard', component: DashboardComponent, canActivate: [AuthGuardGuard], data: { roles: 'admin', public: false } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
