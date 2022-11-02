import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { NotFound404Component } from './others/not-found404/not-found404.component';
import { RouteGuard } from './guard/route.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { LoaderComponent } from './others/loader/loader.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

const routes: Routes = [
  {
    path: "",
    component: SidebarComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
        canActivate: [RouteGuard]
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
  },
  {
    path: "verify-otp",
    component: VerifyOtpComponent,
  },
  {
    path: "loader",
    component: LoaderComponent,
  },
  {
    path: "**",
    component: NotFound404Component,
  }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
