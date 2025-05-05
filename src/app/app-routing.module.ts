import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { ProductComponent } from './product-component/product-component.component';

const routes: Routes = [
  {path: '', redirectTo: '/login' ,pathMatch: "full"},
  {path: 'login',component: LoginComponentComponent},
  {path: 'productsList',component:ProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
