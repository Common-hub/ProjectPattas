import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './Component/login-component/login-component.component';
import { ProductComponent } from './Component/product-component/product-component.component';
import { AuthGuardGuard } from './Services/auth-guard.guard';
import { KartItemsComponent } from './Component/kart-items/kart-items.component';

const routes: Routes = [
  {path: '', redirectTo: 'productsList', pathMatch:"full"},
  {path: 'login',component: LoginComponentComponent},
  {path: 'productsList',component:ProductComponent},
  {path: 'AddProducts',component:ProductComponent, canActivate: [AuthGuardGuard], data:{role: 'admin'}},
  {path: 'ViewCart',component:KartItemsComponent, canActivate: [AuthGuardGuard], data:{role: 'user'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
