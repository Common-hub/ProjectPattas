import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './Component/login-component/login-component.component';
import { ProductComponent } from './Component/user/product-component/product-component.component';
import { AuthGuardGuard } from './Services/auth-guard.guard';
import { KartItemsComponent } from './Component/user/kart-items/kart-items.component';
import { AddCrackersComponent } from './Component/admin/add-crackers/add-crackers.component';
import { OrderDetailsComponent } from './Component/user/order-details/order-details.component';

const routes: Routes = [
  {path: 'login',component: LoginComponentComponent},
  {path: 'productsList',component:ProductComponent},
  {path: 'addProducts',component:AddCrackersComponent, canActivate: [AuthGuardGuard], data:{role:[ 'admin' ]}},
  {path: 'viewCart',component:KartItemsComponent, canActivate: [AuthGuardGuard], data:{role: ['admin','user']}},
  {path: 'orderStatus',component:OrderDetailsComponent, canActivate: [AuthGuardGuard], data:{role: ['admin','user']}},
  {path: '**', redirectTo: '/productsList', pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
