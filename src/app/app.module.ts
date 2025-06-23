import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './feature/admin/admin.module';
import { UserModule } from './feature/user/user.module';
import { apiInterceptor } from './core/interceptors/apiInterceptor.interceptor';
import { LoginComponentComponent } from './login-component/login-component.component';
import { AlertWindowComponent } from './shared/components/alert-window/alert-window.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    HeaderComponent,
    AlertWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    AdminModule,
    UserModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: apiInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
  export class AppModule { }
