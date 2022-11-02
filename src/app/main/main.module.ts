import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { CustomersComponent } from './customers/customers.component';
import { JobsComponent } from './jobs/jobs.component';
import { ServicesComponent } from './services/services.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VendorsComponent } from './vendors/vendors.component';
import { LoaderComponent } from '../others/loader/loader.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { CarBrandComponent } from './car-brand/car-brand.component';
import { CarModelComponent } from './car-model/car-model.component';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    DashboardComponent,
    CategoryComponent,
    CustomersComponent,
    JobsComponent,
    ServicesComponent,
    SubCategoryComponent,
    LoaderComponent,
    VendorsComponent,
    CustomerDetailsComponent,
    VendorDetailsComponent,
    JobDetailsComponent,
    CarBrandComponent,
    CarModelComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  exports:[LoaderComponent]
})

export class MainModule { }
