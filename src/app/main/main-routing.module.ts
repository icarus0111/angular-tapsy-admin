import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from "@angular/router";
import { CategoryComponent } from './category/category.component';
import { CustomersComponent } from './customers/customers.component';
import { JobsComponent } from './jobs/jobs.component';
import { ServicesComponent } from './services/services.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { CarBrandComponent } from './car-brand/car-brand.component';
import { CarModelComponent } from './car-model/car-model.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "categorys",
    component: CategoryComponent,
  },
  {
    path: "customers",
    component: CustomersComponent,
  },
  {
    path: "customer-details/:id",
    component: CustomerDetailsComponent,
  },
  {
    path: "customer-details-admin/:id",
    component: CustomerDetailsComponent,
  },
  {
    path: "vendors",
    component: VendorsComponent,
  },
  {
    path: "vendor-details/:id",
    component: VendorDetailsComponent,
  },
  {
    path: "jobs",
    component: JobsComponent,
  },
  {
    path: "services",
    component: ServicesComponent,
  },
  {
    path: "sub-categorys",
    component: SubCategoryComponent,
  },
  {
    path: "job-details/:id",
    component: JobDetailsComponent,
  },
  {
    path: "car-brand",
    component: CarBrandComponent,
  },
  {
    path: "car-model",
    component: CarModelComponent,
  }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
