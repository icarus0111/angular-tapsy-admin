import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  createCustomerForm: FormGroup;
  // fileData: File = null;
  // imagebase64: any = null;
  showCustomerForm: boolean = false;
  customersList: Array<object>;
  // baseImageUrl: string = environment.baseImageUrl;
  // updateCategoryId: number;
  showAddBtn: boolean = true;
  showLoader: boolean = false;
  stateList: Array<object>;

  max_customer_show: number = 5;
  current_index: number = 1;
  pagination: any = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService) { }

  ngOnInit() {
    SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(1);
    this.initializeForm();
    this.getCustomersList();
    this.getStateList();
  }


  initializeForm(){
    // window.localStorage.removeItem('token');
    this.createCustomerForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern(/^[a-zA-Z ]*$/)])],
      email: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]\d{9}$/)])],
      address: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(80)])],
      state: [null, Validators.compose([Validators.required])],
      post_code: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])],
    });
  }


  openCustomerForm(){
    console.log('open form'); 
    this.createCustomerForm.reset();   
    this.showCustomerForm = true;
    this.showAddBtn = true;
  }



  closeCustomerForm(){
    // console.log('close form'); 
    this.createCustomerForm.reset();   
    this.showCustomerForm = false;
  }



  onSubmitCustomerForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    if (this.createCustomerForm.invalid) {
      this.showLoader = false;
      return;
    }

    let newCustomerPayload = {
      username: this.createUserName(this.getFormValue().name, this.getFormValue().phone),
      role_id: 2,
      ...this.getFormValue()
    }

    console.log('customer form data :............................', newCustomerPayload);
    
    this.showCustomerForm = false;

    this.apiService.usersRegistration(newCustomerPayload).subscribe((data: any) => {
      // console.log('api responce :...........', data);  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {        
          
          // this.getCustomerList();
          this.createCustomerForm.reset();
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.getCustomersList();
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }   
      
    });
  }



  createUserName(name, phone){
    let nameArr = name.split(' ');
    return `${nameArr[0]}${phone}`;
  }



  getFormValue() {
    return this.createCustomerForm.value;
  }



  getCustomerFormErrors() {
    return this.createCustomerForm.controls;
  }



  disableSubmitBtn() {
    if(this.createCustomerForm.valid){
      return false;
    }else{
      return true;
    }
  }



  getCustomersList() {
    this.current_index = 1;
    this.showLoader = true;
    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };
    console.log('paginationPayload 123: ', paginationPayload);
    
    this.apiService.getCustomerList(paginationPayload).subscribe((data: any) => { 
      console.log('data........sdfsdf......', data);
      
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('getCustomersList decrypted data :..............................', decrypted);
        if(decrypted.status) {
          console.log('getCustomersList api responce customers list :...........', decrypted);
          if(decrypted.data.rows !== null && decrypted.data.rows.length > 0){
            this.customersList = decrypted.data.rows;
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
            //console.log('this.pagination: ', this.pagination);
            // console.log('api responce vendors list :...........', this.customersList);
            this.showLoader = false;
          }else{
            this.showLoader = false;
            this.customersList = [];
          }
        }else {
          this.showLoader = false;
          this.toaster.showError(decrypted.msg, 'Error!');
        }
      } else {
        console.log('getCustomersList error');
        
      }     
    }, error => {
      console.log('getCustomersList error', error);
      
    });
  }

  current_pagination(page_index) {
    this.current_index = page_index;
    this.getPaginationCustomersList();
  }

  previous_pagination() {
    this.current_index--;
    if(this.current_index < 1) {
      this.current_index++;
    } else {
      this.getPaginationCustomersList();
    }
  }

  next_pagination() {
    this.current_index++;
    if(this.current_index > this.pagination.length) {
      this.current_index--;
    } else {
      this.getPaginationCustomersList();
    }
  }

  getPaginationCustomersList() {
    this.showLoader = true;
    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    }
    console.log('paginationPayload 2: ', paginationPayload);

    this.apiService.getCustomerList(paginationPayload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          console.log('api responce customers list :...........', decrypted);
          if(decrypted.data.rows!== null && decrypted.data.rows.length > 0){
            this.customersList = decrypted.data.rows;
            
            this.pagination.forEach(element => {
              element.active = false;
            });
            this.pagination[this.current_index - 1].active = true;

            // console.log('api responce vendors list :...........', this.customersList);
            this.showLoader = false;
          }else{
            this.showLoader = false;
            this.customersList = [];
          }
        }else {
          this.showLoader = false;
          this.toaster.showError(decrypted.msg, 'Error!');
        }
      }     
    });
  }


  getStateList() {
    this.showLoader = true;
    this.apiService.getAllStateList().subscribe((data: any) => {  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          console.log('api responce state list :...........', decrypted);
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.stateList = decrypted.data;
            // console.log('api responce vendors list :...........', this.customersList);
            this.showLoader = false;
          }else{
            this.showLoader = false;
            this.stateList = [];
          }
        }else {
          this.showLoader = false;
          this.toaster.showError(decrypted.msg, 'Error!');
        }
      }     
    });
  }



  goToProfileDetails(id){
    localStorage.setItem('profiledetailstype', 'user');
    this.router.navigate(['/customer-details/',id]);
  }
  



}
