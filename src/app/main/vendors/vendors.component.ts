import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from '../../../environments/environment';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { DataTablesModule } from 'angular-datatables';
declare var $;

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

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
  approvedVendors: Array<any> = [];
  notApprovedVendors: Array<any> = [];
  // current_index: number = 1;

  dtOptions: DataTables.Settings = {};
  dtUsers =[
    {"id": 101, "firstName": "Anil", "lastName": "Singh"},
    {"id": 102, "firstName": "Reena", "lastName": "Singh"},
    {"id": 103, "firstName": "Aradhay", "lastName": "Simgh"},
    {"id": 104, "firstName": "Dilip", "lastName": "Singh"},
    {"id": 105, "firstName": "Alok", "lastName": "Singh"},
    {"id": 106, "firstName": "Sunil", "lastName": "Singh"},
    {"id": 107, "firstName": "Sushil", "lastName": "Singh"},
    {"id": 108, "firstName": "Sheo", "lastName": "Shan"},
    {"id": 109, "firstName": "Niranjan", "lastName": "R"},
    {"id": 110, "firstName": "Lopa", "lastName": "Mudra"},
    {"id": 111, "firstName": "Paramanand","lastName": "Tripathi"}
  ];

  max_customer_show: number = 5;
  current_index: number = 1;
  pagination: any = [];

  max_customer_show2: number = 5;
  current_index2: number = 1;
  pagination2: any = [];
  vendorList2: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService, private dSL: DynamicScriptLoaderService) { }

  ngOnInit() {
    this.loadScripts();
    SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(2);
    this.initializeForm();
    this.getCategoryList();
    this.getVendorList();
    this.getVendorList2();
    this.getStateList();   
    
    
    this.dtOptions = {
      data:this.dtUsers,
      columns: [{title: 'User ID', data: 'id'},
            {title: 'First Name', data: 'firstName'},
            {title: 'Last Name', data: 'lastName' }]
    };

  }



  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dSL.load('jquery', 'popper', 'bootstrapjs', 'webfont', 'chartcircle', 'jqueryui', 'jqueryuitouchpunch', 'atlantis', 'settingdemo', 'demo', 'datatables').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }



  //-------------------------------------------------------------
  // initialize vendor add form
  //-------------------------------------------------------------
  initializeForm(){
    // window.localStorage.removeItem('token');
    this.createVendorForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern(/^[a-zA-Z ]*$/)])],
      email: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]\d{9}$/)])],
      address: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(80)])],
      state: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      post_code: [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(/^[0-9]*$/)])],
      category_id: [null, Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])],
    });
  }


  //-------------------------------------------------------------
  // open vendor add form
  //-------------------------------------------------------------
  openVendorForm(){
    console.log('open form'); 
    this.createVendorForm.reset();   
    this.showVendorForm = true;
    this.showAddBtn = true;
  }



  //-------------------------------------------------------------
  // closing vendor creation form method
  //-------------------------------------------------------------
  closeVendorForm(){
    // console.log('close form'); 
    this.createVendorForm.reset();   
    this.showVendorForm = false;
  }


  //-------------------------------------------------------------
  // add new vendor method
  //-------------------------------------------------------------
  onSubmitVendorForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    if (this.createVendorForm.invalid) {
      this.showLoader = false;
      return;
    }

    let newCustomerPayload = {
      username: this.createUserName(this.getFormValue().name, this.getFormValue().phone),
      role_id: 3,
      ...this.getFormValue()
    }

    // console.log('vendors form data :............................', newCustomerPayload);    
    this.showVendorForm = false;
    this.apiService.usersRegistration(newCustomerPayload).subscribe((data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          
          // this.getCustomerList();
          this.createVendorForm.reset();
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }     
      
    });
  }



  //-------------------------------------------------------------
  // create username method
  //-------------------------------------------------------------
  createUserName(name, phone){
    let nameArr = name.split(' ');
    return `${nameArr[0]}${phone}`;
  }



  //-------------------------------------------------------------
  // getting form value method
  //-------------------------------------------------------------
  getFormValue() {
    return this.createVendorForm.value;
  }


  //-------------------------------------------------------------
  // getting form validation errors method
  //-------------------------------------------------------------
  getVendorFormErrors() {
    return this.createVendorForm.controls;
  }
  // getCustomerFormErrors



  //-------------------------------------------------------------
  // disable submit btn method
  //-------------------------------------------------------------
  disableSubmitBtn() {
    if(this.createVendorForm.valid){
      return false;
    }else{
      return true;
    }
  }



  //-------------------------------------------------------------
  // getting category list method
  //-------------------------------------------------------------
  getCategoryList(){
    this.showLoader = true;
    this.apiService.getCategoryList().subscribe((data: any) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.categoryList = decrypted.data;
            // console.log('api responce category list :...........', this.categoryList);
            this.showLoader = false;
          }else{
            this.categoryList = [];
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
  // getting vendor list
  //-------------------------------------------------------------
  getVendorList() {
    this.current_index = 1;
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getApprovedVendorList(paginationPayload).subscribe((data: any) => {   
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          // console.log('api responce vendors list :...........', data);
          if(decrypted.data !== null && decrypted.data.rows.length > 0) {
            this.vendorList = decrypted.data.rows;
            //console.log('api responce vendors list :...........', this.vendorList);
            this.approvedVendors = this.getAppVendors(this.vendorList);
            // this.notApprovedVendors = this.getNotAppVendors(this.vendorList);
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
          }else {
            this.vendorList = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }

        // this.dataTableScript();
      }      
    });
  }





  //-------------------------------------------------------------
  // getting vendor list
  //-------------------------------------------------------------
  getVendorList2() {
    this.current_index = 1;
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getNonApprovedVendorList(paginationPayload).subscribe((data: any) => {   
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          // console.log('api responce vendors list :...........', data);
          if(decrypted.data !== null && decrypted.data.rows.length > 0) {
            this.vendorList2 = decrypted.data.rows;
            //console.log('api responce vendors list :...........', this.vendorList);
            // this.approvedVendors = this.getAppVendors(this.vendorList);
            this.notApprovedVendors = this.getNotAppVendors(this.vendorList2);

            let total_customers = decrypted.data.count;

            let no_of_pagination = 0;
            if(+total_customers > this.max_customer_show2) {
              let mod_number = +total_customers % this.max_customer_show2;
              no_of_pagination = ((+total_customers - mod_number) / this.max_customer_show2);
              
              if(mod_number > 0) {
                no_of_pagination++;
              }
            } else {
              no_of_pagination = 1;
            }

            this.pagination2 = [];
            for(let i = 1; i <= no_of_pagination; i++) {
              if(i == 1) {
                this.pagination2.push({
                  "value": i,
                  "active": true
                });
              } else {
                this.pagination2.push({
                  "value": i,
                  "active": false
                });
              }
            }

            this.showLoader = false;
          }else {
            this.vendorList2 = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }

        // this.dataTableScript();
      }      
    });
  }




  approveVendor(id) {
    this.showLoader = true;

    let payload = { id: id, updateData: { approved: 1 } }

    this.apiService.vendorApprove(payload).subscribe((data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          this.showLoader = false;

          this.getVendorList();
          this.toaster.showSuccess(decrypted.msg, 'Success!');
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }     
      
    });
  }


  onSubmitUpdateVendorForm() {

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






  dataTableScript() {
    $(document).ready(function() {
			$('#basic-datatables').DataTable({
			});

			$('#multi-filter-select').DataTable( {
				"pageLength": 5,
				initComplete: function () {
					this.api().columns().every( function () {
						var column = this;
						var select = $('<select class="form-control"><option value=""></option></select>')
						.appendTo( $(column.footer()).empty() )
						.on( 'change', function () {
							var val = $.fn.dataTable.util.escapeRegex(
								$(this).val()
								);

							column
							.search( val ? '^'+val+'$' : '', true, false )
							.draw();
						} );

						column.data().unique().sort().each( function ( d, j ) {
							select.append( '<option value="'+d+'">'+d+'</option>' )
						} );
					} );
				}
			});

			// Add Row
			$('#add-row').DataTable({
				"pageLength": 5,
			});

			var action = '<td> <div class="form-button-action"> <button type="button" data-toggle="tooltip" title="" class="btn btn-link btn-primary btn-lg" data-original-title="Edit Task"> <i class="fa fa-edit"></i> </button> <button type="button" data-toggle="tooltip" title="" class="btn btn-link btn-danger" data-original-title="Remove"> <i class="fa fa-times"></i> </button> </div> </td>';

			$('#addRowButton').click(function() {
				$('#add-row').dataTable().fnAddData([
					$("#addName").val(),
					$("#addPosition").val(),
					$("#addOffice").val(),
					action
					]);
				$('#addRowModal').modal('hide');

			});
		});
  }

  getAppVendors(arr: Array<any>){
    return arr.filter(item => {
      if(item.approved == 1){
        return item;
      }
    })
  }

  getNotAppVendors(arr){
    return arr.filter(item => {
      if(item.approved == 0){
        return item;
      }
    })
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





  current_pagination2(page_index) {
    this.current_index2 = page_index;
    this.getPaginationCustomersList2();
  }

  previous_pagination2() {
    this.current_index2--;
    if(this.current_index2 < 1) {
      this.current_index2++;
    } else {
      this.getPaginationCustomersList2();
    }
  }

  next_pagination2() {
    this.current_index2++;
    if(this.current_index2 > this.pagination2.length) {
      this.current_index2--;
    } else {
      this.getPaginationCustomersList2();
    }
  }





  getPaginationCustomersList() {
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getApprovedVendorList(paginationPayload).subscribe((data: any) => {   
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          // console.log('api responce vendors list :...........', data);
          if(decrypted.data !== null && decrypted.data.length > 0) {
            this.vendorList = decrypted.data;
            //console.log('api responce vendors list :...........', this.vendorList);
            this.approvedVendors = this.getAppVendors(this.vendorList);
            // this.notApprovedVendors = this.getNotAppVendors(this.vendorList);
            this.pagination.forEach(element => {
              element.active = false;
            });
            this.pagination[this.current_index - 1].active = true;
            
            this.showLoader = false;
          }else {
            this.vendorList = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }

        // this.dataTableScript();
      }      
    });
  }






  getPaginationCustomersList2() {
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getNonApprovedVendorList(paginationPayload).subscribe((data: any) => {   
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          // console.log('api responce vendors list :...........', data);
          if(decrypted.data !== null && decrypted.data.length > 0) {
            this.vendorList = decrypted.data;
            //console.log('api responce vendors list :...........', this.vendorList);
            // this.approvedVendors = this.getAppVendors(this.vendorList);
            this.notApprovedVendors = this.getNotAppVendors(this.vendorList);

            this.pagination2.forEach(element => {
              element.active = false;
            });
            this.pagination2[this.current_index2 - 1].active = true;

            this.showLoader = false;
          }else {
            this.vendorList = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }

        // this.dataTableScript();
      }      
    });
  }


  

}
