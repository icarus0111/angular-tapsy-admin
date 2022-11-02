import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  createServiceForm: FormGroup;
  showServiceForm: boolean = false;
  fileData: File = null;
  imagebase64: any = null;
  categoryList: Array<object>;
  subCategoryList: Array<object> = [];
  baseImageUrl: string = environment.baseImageUrl;
  serviceList: Array<object>;
  currentServId: number;
  currentCatId: number;
  currentSubCatId: number;
  showAddBtn: boolean = true;
  updateServicePayload: any = {};
  showLoader: boolean = false;

  max_customer_show: number = 5;
  current_index: number = 1;
  pagination: any = [];
  selectedImage: any = null;
  

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService, private http: HttpClient) { }

  ngOnInit() {
    SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(2);
    this.initializeForm();
    this.getCategoryList();
    this.getServiceList();
  }




  initializeForm(){
    // window.localStorage.removeItem('token');
    this.createServiceForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(40)])],
      category_id: [null, Validators.compose([Validators.required])],
      sub_category_id: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required])],
      price_2: [null, Validators.compose([Validators.required])],
      price_3: [null, Validators.compose([Validators.required])],
      service_icon: [null, Validators.compose([])]
    });
  }



  disableSubmitBtn() {
    if(this.createServiceForm.valid){
      return false;
    }else{
      return true;
    }
  }


  getFormValue() {
    return this.createServiceForm.value;
  }


  async fileProgress(fileInput: any) {
    // this.imagebase64 = await this.helper.imageProgress(fileInput);
    // // console.log('image 64 convert success : .............', this.imagebase64);  
    // if(this.imagebase64 == '' || this.imagebase64 == undefined){
    //   this.imagebase64 = null;
    //   this.createServiceForm.patchValue({
    //     service_icon: null
    //   });
    // }
    
    this.uploadAvatar(fileInput);
  }




  uploadAvatar(event) {
    this.showLoader = true;
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {

     let file: File = fileList[0];
     console.log('selected image : ', file);

     let formData:FormData = new FormData();
     formData.append('imagefile', file, file.name);
     let headers = new HttpHeaders();

     /** No need to include Content-Type in Angular 4 */
     // headers.append('Content-Type', 'multipart/form-data');
     // headers.append('Accept', 'application/json');
 
      this.http.post(`${environment.baseUrl}/category/uploadImage`, formData).subscribe((res: any)=>{
        console.log('image upload responce : ', res);  
        
        if(res && res.status){
            this.selectedImage = res.path;
            console.log('form value : ', this.createServiceForm.value); 
            this.toaster.showSuccess(res.message, 'Success!');           
          }else{
            console.log('form value : ', this.createServiceForm.value);
            this.selectedImage = null;
            this.toaster.showError(res.message, 'Error!');
          }
          this.showLoader = false;    
      }, error => {
        this.showLoader = false;
        console.log('image upload error : ', error);        
      })
    }
  }




  openServiceForm(){ 
    this.createServiceForm.reset();
    this.showServiceForm = true;
    this.showAddBtn = true;
  }



  closeServiceForm(){   
    this.createServiceForm.reset();
    this.showServiceForm = false;
  }



  onSubmitCreateServiceForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    if (this.createServiceForm.invalid) {
      return;
    }

    const newServicePayload = {
      name: this.getFormValue().name,
      category_id: this.getFormValue().category_id,
      sub_category_id: this.getFormValue().sub_category_id,
      price: this.getFormValue().price,
      price_2: this.getFormValue().price_2,
      price_3: this.getFormValue().price_3,
      service_icon: this.selectedImage
    }

    console.log('new service data......', newServicePayload);
    this.showServiceForm = false;
    this.apiService.createService(newServicePayload).subscribe((data: any) => {
      // console.log('api responce :...........', data);
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {          
          this.createServiceForm.reset();
          this.imagebase64 = null;
          this.selectedImage = null;
          this.getServiceList();
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
          this.selectedImage = null;
        }
      }      
      
    });
  }



  getCategoryList(){
    this.showLoader = true;
    this.apiService.getCategoryList().subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.categoryList = decrypted.data;
            console.log('api responce category list :...........', this.categoryList);
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



  getServiceList(){
    this.current_index = 1;
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getServiceListWithPagination(paginationPayload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          console.log('service list :...........', decrypted.data);
          if(decrypted.data !== null && decrypted.data.rows.length > 0){
            this.serviceList = decrypted.data.rows;
            // console.log('service list :...........', this.serviceList);

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
          }else{
            this.serviceList = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }           
      
    });
  }



  getSubCategoriesAfterChooseCategory(e){
    this.showLoader = true;

    let payload = {}

    if(e.target && e.target.value){
      payload = {
        category_id: e.target.value
      }
    }else{
      payload = {
        category_id: e
      }
    }

    // console.log('body :...........', payload);

    this.apiService.getSubCategoryByCategoryId(payload).subscribe((data: any) => {  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          if(decrypted.data !== null && decrypted.data.length > 0){
            this.subCategoryList = decrypted.data;
            // console.log('api responce sub category list :...........', this.subCategoryList);
            this.showLoader = false;
          }else{
            this.subCategoryList = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }          
      
    });
  }



  getServiceFormErrors() {
    return this.createServiceForm.controls;
  }



  onClickEditService(service){
    console.log('service :...................', service);

    this.currentServId = service.id;
    this.currentCatId = service.category_name.id;
    this.getSubCategoriesAfterChooseCategory(service.category_name.id);
    this.currentSubCatId = service.sub_category.id;

    this.createServiceForm.patchValue({
      name: service.name,
      category_id: service.category_name.id,
      sub_category_id: service.sub_category.id,
      price: service.price,
      price_2: service.price_2,
      price_3: service.price_3
    });

    this.showAddBtn = false;
    this.showServiceForm = true;
  }



  onSubmitupdateServiceForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    this.updateServicePayload = {};
    if (this.createServiceForm.invalid) {
      return;
    }

    this.updateServicePayload = {
      id: this.currentServId,
      name: this.getFormValue().name,
      price: this.getFormValue().price,
      price_2: this.getFormValue().price_2,
      price_3: this.getFormValue().price_3,
      service_icon: this.selectedImage    
    }

    if(this.currentSubCatId != this.getFormValue().sub_category_id) {
      this.updateServicePayload.isCategoryChanged = false;
      this.updateServicePayload.category_id = this.getFormValue().category_id;
      this.updateServicePayload.sub_category_id = this.getFormValue().sub_category_id;
    }

    if(this.currentCatId != this.getFormValue().category_id) {  
      this.updateServicePayload.isCategoryChanged = true;    
      this.updateServicePayload.previous = this.currentCatId;
      // this.updateServicePayload.category_id = this.getFormValue().category_id;
    }

    console.log('service update payload', this.updateServicePayload);    
    this.showServiceForm = false;
    
    this.apiService.updateService(this.updateServicePayload).subscribe((data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          
          this.getServiceList();
          this.createServiceForm.reset();
          this.imagebase64 = null;
          this.selectedImage = null;
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
          this.selectedImage = null;
        }
      }     
      
    });
  }




  async openAlert(id, category_id){
    console.log(id, category_id);
    
    let result = await this.toaster.showConfirmationAlert('Are you sure ?', '', 'warning');
    if(result.value){
      this.showLoader = true;
      let payload = {id, category_id};
      this.apiService.deleteService(payload).subscribe((data:any) => {
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
          // console.log('decrypted data :..............................', decrypted);
          if(decrypted.status) {
            this.getServiceList();
            this.toaster.showSuccess(decrypted.msg, 'Success!');
            this.showLoader = false;
          }else {
            this.toaster.showError(decrypted.msg, 'Error!');
            this.showLoader = false;
          }
        }        
      })
    }          
  }





  current_pagination(page_index) {
    this.current_index = page_index;
    this.getServiceList2();
  }

  previous_pagination() {
    this.current_index--;
    if(this.current_index < 1) {
      this.current_index++;
    } else {
      this.getServiceList2();
    }
  }

  next_pagination() {
    this.current_index++;
    if(this.current_index > this.pagination.length) {
      this.current_index--;
    } else {
      this.getServiceList2();
    }
  }





  getServiceList2(){
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    };

    this.apiService.getServiceListWithPagination(paginationPayload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          console.log('service list :...........', data);
          if(decrypted.data !== null && decrypted.data.rows.length > 0){
            this.serviceList = decrypted.data.rows;
            // console.log('service list :...........', this.serviceList);
            this.pagination.forEach(element => {
              element.active = false;
            });
            this.pagination[this.current_index - 1].active = true;

            this.showLoader = false;
          }else{
            this.serviceList = [];
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
