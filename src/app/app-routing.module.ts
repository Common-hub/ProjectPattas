import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { AuthGuardGuard } from './core/gaurdds/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'user/productsList', pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('./feature/admin/admin.module').then(module => module.AdminModule), canLoad: [AuthGuardGuard], data: { role: 'admin',public: false } },
  { path: 'user', loadChildren: () => import('./feature/user/user.module').then(module => module.UserModule), canLoad: [AuthGuardGuard], data: { role: 'user', public: true } },
  { path: 'login', component: LoginComponentComponent, data: {public: true} },
  { path: '**', redirectTo: 'user/productsList' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
