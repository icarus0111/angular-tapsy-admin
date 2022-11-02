import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFound404Component } from './others/not-found404/not-found404.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {ApiService} from "./services/api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./interceptors/interceptor";
// import * as $ from "jquery";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { LocationStrategy, Location, PathLocationStrategy } from '@angular/common';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { MainModule } from './main/main.module';
import { DataTablesModule } from 'angular-datatables';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
// import { LoaderComponent } from './others/loader/loader.component';

// import {ToastyModule} from 'ng2-toasty';
// import { DashboardComponent } from './main/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    NotFound404Component,
    ForgotPasswordComponent,
    VerifyOtpComponent,
    ChangePasswordComponent
    // DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule, // required animations module
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    SweetAlert2Module,
    HttpClientModule,
    MainModule,
    DataTablesModule
    // ToastyModule.forRoot()
  ],
  providers: [ApiService, 
    {provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi : true}
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }


// https://www.devglan.com/angular/angular-8-crud-example
// https://w3path.com/new-angular-8-file-upload-or-image-upload/
