import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { apiInterceptor } from './interceptors/my-interceptor.interceptor';
import { LoginComponentComponent } from './Component/login-component/login-component.component';
import { AlertWindowComponent } from './Component/alert-window/alert-window.component';
import { HeaderComponent } from './Component/header/header.component';
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
