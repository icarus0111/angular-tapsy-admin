import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {

  params: any;
  showLoader: boolean = false;
  customerDetails: Array<any>;
  showJobList: boolean;
  jobListForVendor: Array<any>;

  max_customer_show: number = 10;
  current_index: number = 1;
  pagination: any = [];

  constructor(private route: ActivatedRoute, private helper: HelpermethodsService, private apiService: ApiService, private toaster: ToasterService) { 
    this.route.paramMap.subscribe((params: any) => {      
      this.params = params.params;  
      console.log('params :...........', this.params);    
    });
  }

  ngOnInit() {
    this.getVendorDetails();
    this.getAllJobsListByVendor();
  }


  //-------------------------------------------------------------
  // getting customer details method
  //-------------------------------------------------------------
  getVendorDetails(){
    this.showLoader = true;

    let payload = {
      id: this.params.id
    }

    this.apiService.getVendorDetails(payload).subscribe((data: any) => {  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.customerDetails = decrypted.data;
            this.customerDetails.forEach((item: any) => {
              if(item.name != null){
                let arr = item.name.split(' ');
                console.log('name word array :.........', arr);
                item.firstName = arr[0];              
                item.lastName = arr[1];              
              }else{
                item.firstName = '';              
                item.lastName = '';
              }
            });
            console.log('customer details data :...........', this.customerDetails);
            this.showLoader = false;
          }else{
            this.customerDetails = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }          
      
    });
  }





  //-------------------------------------------------------------
  // getting vendor jobs list
  //-------------------------------------------------------------
  getAllJobsListByVendor(){
    this.showLoader = true;
    this.current_index = 1;

    let payload = {
      vendor_id: this.params.id,
      limit: this.max_customer_show,
      page: this.current_index
    }

    console.log('job list for vendor payload :..............................', payload);

    this.apiService.getAllJobsListByVendorWithPagination(payload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('job list for vendor :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data.rows && decrypted.data.rows.length > 0){
            this.jobListForVendor = decrypted.data.rows;

            let total_customers = decrypted.data.count;

            let no_of_pagination = 0;
            if(+total_customers > this.max_customer_show) {
              let mod_number = +total_customers % this.max_customer_show;
              no_of_pagination = ((+total_customers - mod_number) / this.max_customer_show);
              
              if(mod_number > 0) {
                no_of_pagination++;
              }
            } else {
              no_of_pagination = 1;
            }

            this.pagination = [];
            for(let i = 1; i <= no_of_pagination; i++) {
              if(i == 1) {
                this.pagination.push({
                  "value": i,
                  "active": true
                });
              } else {
                this.pagination.push({
                  "value": i,
                  "active": false
                });
              }
            }

            this.showLoader = false;
            this.showJobList = true;
          }else {
            this.jobListForVendor = [];
            this.showJobList = false;
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }           
      
    });
  }





  current_pagination(page_index) {
    this.current_index = page_index;
    this.getAllJobsListByVendor2();
  }

  previous_pagination() {
    this.current_index--;
    if(this.current_index < 1) {
      this.current_index++;
    } else {
      this.getAllJobsListByVendor2();
    }
  }

  next_pagination() {
    this.current_index++;
    if(this.current_index > this.pagination.length) {
      this.current_index--;
    } else {
      this.getAllJobsListByVendor2();
    }
  }





  getAllJobsListByVendor2(){
    this.showLoader = true;

    let payload = {
      vendor_id: this.params.id,
      limit: this.max_customer_show,
      page: this.current_index
    }

    this.apiService.getAllJobsListByVendorWithPagination(payload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('job list for user :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data.rows && decrypted.data.rows.length > 0){
            this.jobListForVendor = decrypted.data.rows;

            this.pagination.forEach(element => {
              element.active = false;
            });
            this.pagination[this.current_index - 1].active = true;

            this.showLoader = false;
            this.showJobList = true;
          }else {
            this.jobListForVendor = [];
            this.showJobList = false;
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }           
      
    });
  }

}
