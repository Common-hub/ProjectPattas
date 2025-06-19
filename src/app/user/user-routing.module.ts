import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './Components/product-component/product-component.component';
import { KartItemsComponent } from './Components/kart-items/kart-items.component';
import { OrderDetailsComponent } from './Components/order-details/order-details.component';
import { AuthGuardGuard } from '../Services/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'productsList', pathMatch: 'full' },
  { path: 'productsList', component: ProductComponent, canActivate: [AuthGuardGuard], data:{roles: 'user', public: true} },
  { path: 'viewCart', component: KartItemsComponent, canActivate: [AuthGuardGuard], data:{roles: 'user', public: false}  },
  { path: 'orderStatus', component: OrderDetailsComponent, canActivate: [AuthGuardGuard], data:{roles: 'user', public: false}  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
