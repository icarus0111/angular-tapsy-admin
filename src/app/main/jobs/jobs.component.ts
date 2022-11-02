import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  createVendorForm: FormGroup;
  // fileData: File = null;
  // imagebase64: any = null;
  showVendorForm: boolean = false;
  categoryList: Array<object>;
  vendorList: Array<object>;
  // baseImageUrl: string = environment.baseImageUrl;
  // updateCategoryId: number;
  showAddBtn: boolean = true;
  showLoader: boolean = false;
  stateList: Array<object>;
  allJobList: Array<any>;

  rows = [
    // { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    // { name: 'Dany', gender: 'Male', company: 'KFC' },
    // { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];

  columns = [
    // { prop: 'name' },
    // { name: 'Gender' },
    // { name: 'Company' }
  ];

  max_customer_show: number = 5;
  current_index: number = 1;
  pagination: any = [];

  constructor(
    private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService
  ) { }

  ngOnInit() {
    SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(3);
    this.getJobsList();
    this.fetch((data) => {
      this.rows = data;
    });
  }


  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `http://swimlane.github.io/ngx-datatable/assets/data/company.json`);
 
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
 
    req.send();
  }



  //-------------------------------------------------------------
  // getting jobs list
  //-------------------------------------------------------------
  getJobsList() {
    this.current_index = 1;
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getAllJobsListWithPagination(paginationPayload).subscribe((data: any) => {   
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('all job list data :..............................', decrypted);
        if(decrypted.status) {

          if(decrypted.data.rows !== null && decrypted.data.rows.length > 0){
          this.showLoader = false;
          // console.log('api responce vendors list :...........', data);
          this.allJobList = decrypted.data.rows;

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

          }else{
            this.allJobList = [];
            this.showLoader = false;
          }

        }else {
          this.allJobList = [];
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }      
    });
  }






  onClickViewJob(id) {
    console.log(id);
    this.router.navigate(['job-details', id]);    
  }





  current_pagination(page_index) {
    this.current_index = page_index;
    this.getJobsList2();
  }

  previous_pagination() {
    this.current_index--;
    if(this.current_index < 1) {
      this.current_index++;
    } else {
      this.getJobsList2();
    }
  }

  next_pagination() {
    this.current_index++;
    if(this.current_index > this.pagination.length) {
      this.current_index--;
    } else {
      this.getJobsList2();
    }
  }






  getJobsList2() {
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getAllJobsListWithPagination(paginationPayload).subscribe((data: any) => {   
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('all job list data :..............................', decrypted);
        if(decrypted.status) {

          if(decrypted.data.rows !== null && decrypted.data.rows.length > 0){
          this.showLoader = false;
          // console.log('api responce vendors list :...........', data);
          this.allJobList = decrypted.data.rows;

          this.pagination.forEach(element => {
            element.active = false;
          });
          this.pagination[this.current_index - 1].active = true;

          }else{
            this.allJobList = [];
            this.showLoader = false;
          }

        }else {
          this.allJobList = [];
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }      
    });
  }




}
