import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from '../../../environments/environment';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-car-model',
  templateUrl: './car-model.component.html',
  styleUrls: ['./car-model.component.css']
})
export class CarModelComponent implements OnInit {

  createSubCategoryForm: FormGroup;
  showSubCategoryForm: boolean = false;
  fileData: File = null;
  imagebase64: any = null;
  categoryList: Array<object>;
  baseImageUrl: string = environment.baseImageUrl;
  subCategoryList: Array<object> = [];
  currentSubCatId: number;
  currentParentId: number;
  updateSubCategoryPayload: any = {};
  showAddBtn: boolean = true;
  showLoader: boolean = false;
  selectedImage: any = null;

  max_customer_show: number = 20;
  current_index: number = 1;
  pagination: any = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService, private http: HttpClient) { }

  ngOnInit() {
    SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(2);
    this.initializeForm();
    this.getCategoryList();
    this.getSubCategoryList();
  }


  initializeForm(){
    // window.localStorage.removeItem('token');
    this.createSubCategoryForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(40)])],
      brand_id: ['', Validators.compose([Validators.required])],
      kd_compatibility: ['', Validators.compose([Validators.required])], 
      start_year: ['', Validators.compose([Validators.required])], 
      end_year: ['', Validators.compose([])] 
    });
  }



  disableSubmitBtn() {
    if(this.createSubCategoryForm.valid){
      return false;
    }else{
      return true;
    }
  }


  getFormValue() {
    return this.createSubCategoryForm.value;
  }


  async fileProgress(fileInput: any) {    
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
 
      this.http.post(`${environment.baseUrl}/model/uploadImage`, formData).subscribe((res: any)=>{
        console.log('image upload responce : ', res);  
        
        if(res && res.status){
            // this.createCategoryForm.patchValue({
            //   category_icon: res.path
            // });
            this.selectedImage = res.path;
            // console.log('form value : ', this.createCategoryForm.value);   
            this.toaster.showSuccess(res.message, 'Success!');         
          }else{
            // this.createCategoryForm.patchValue({
            //   category_icon: null
            // });
            // console.log('form value : ', this.createCategoryForm.value);
            this.selectedImage = null;
            this.toaster.showError(res.message, 'Error!');
          }
          this.showLoader = false;    
      }, error => {
        this.showLoader = false;
        console.log('image upload error : ', error);
        this.toaster.showError('Image upload fail', 'Error!');        
      })
    }
  }



  //-------------------------------------------------------------
  // close sub-category form method
  //-------------------------------------------------------------
  openSubCategoryForm(){
    console.log('open form');  
    this.createSubCategoryForm.reset();  
    this.showSubCategoryForm = true;
    this.showAddBtn = true;
  }



  //-------------------------------------------------------------
  // close sub-category form method
  //-------------------------------------------------------------
  closeSubCategoryForm(){
    console.log('close form');  
    this.createSubCategoryForm.reset();  
    this.showSubCategoryForm = false;
  }



  //-------------------------------------------------------------
  // add new sub-category form method
  //-------------------------------------------------------------
  onSubmitCreateSubCategoryForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    if (this.createSubCategoryForm.invalid) {
      this.showLoader = false;
      return;
    }

    const payload = {
      name: this.getFormValue().name,
      brand_id: this.getFormValue().brand_id,
      image: this.selectedImage,
      kd_compatibility: this.getFormValue().kd_compatibility,
      start_year: this.getFormValue().start_year,
      end_year: this.getFormValue().end_year
    }

    // console.log('new model data......', payload);

    this.showSubCategoryForm = false;

    this.apiService.createModel(payload).subscribe((data: any) => {
      // console.log('api responce :...........', data); 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          this.getSubCategoryList();          
          this.createSubCategoryForm.reset();
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




  //-------------------------------------------------------------
  // getting category list method
  //-------------------------------------------------------------
  getCategoryList(){
    this.showLoader = true;
    this.apiService.getBrandAllList().subscribe((data: any) => { 
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
  // getting sub-category list method
  //-------------------------------------------------------------
  getSubCategoryList(){
    this.current_index = 1;
    this.showLoader = true;

    let payload = {
      limit: this.max_customer_show,
      page: this.current_index
    }

    this.apiService.getModelList(payload).subscribe((data: any) => {  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('model data :..............................', decrypted);
        if(decrypted.status) {
          if(decrypted.data.rows != null && decrypted.data.rows.length > 0){
            this.subCategoryList = decrypted.data.rows;
            // this.subCategoryList.forEach((item:any) => {
            //   item.serviceCount = item.child_service.length
            // });
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
            // console.log('api responce sub category list ### :...........', this.subCategoryList);
          }else{
            this.subCategoryList = [];
          }
          // this.getSubCategoryList();
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }     
    });
  }



  //-------------------------------------------------------------
  // getting sub-category form validation errors method
  //-------------------------------------------------------------
  getSubCategoryFormErrors() {
    return this.createSubCategoryForm.controls;
  }



  //-------------------------------------------------------------
  // on click edit sub-category btn to show the edit form
  //-------------------------------------------------------------
  onClickEditSubCategory(subCat){
    console.log('sub-category :...................', subCat);

    this.currentSubCatId = subCat.id;
    this.currentParentId = subCat.brand_id;

    this.createSubCategoryForm.patchValue({
      name: subCat.name,
      brand_id: subCat.brand_id,
      kd_compatibility: subCat.kd_compatibility,
      start_year: subCat.start_year,
      end_year: subCat.end_year,
    });

    this.showAddBtn = false;
    this.showSubCategoryForm = true;
  }



  //-------------------------------------------------------------
  // update sub-category method
  //-------------------------------------------------------------
  onSubmitupdateSubCategoryForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    this.updateSubCategoryPayload = {};

    if (this.createSubCategoryForm.invalid) {
      this.showLoader = false;
      return;
    }

    this.updateSubCategoryPayload = {
        id: this.currentSubCatId,
        updatedata : {
        name: this.getFormValue().name,
        brand_id: this.getFormValue().brand_id,
        // image: this.selectedImage,
        kd_compatibility: this.getFormValue().kd_compatibility,
        start_year: this.getFormValue().start_year,
        end_year: this.getFormValue().end_year    
      }
    }

    console.log('image data : ', this.selectedImage);

    if(this.selectedImage != null && this.selectedImage != ''){
      this.updateSubCategoryPayload.updatedata.image = this.selectedImage;
    }

    console.log('model update payload', this.updateSubCategoryPayload);
    this.showSubCategoryForm = false;

    this.apiService.updateModel(this.updateSubCategoryPayload).subscribe((data: any) => {
      // console.log('api responce :...........', data);  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {          
          this.getSubCategoryList();
          this.createSubCategoryForm.reset();
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




  //-------------------------------------------------------------
  // open confirmation alert method
  //-------------------------------------------------------------
  async openAlert(id){
    console.log(id);
    
    let result = await this.toaster.showConfirmationAlert('Are you sure ?', '', 'warning');
    // console.log('alert action value :.................', result); 
    if(result.value){
      this.showLoader = true;
      let payload = {id};

      this.apiService.deleteModel(payload).subscribe((data: any) => {
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);

          if(decrypted.status) {
            this.getSubCategoryList();
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




  previous_pagination() {
    this.current_index--;
    if(this.current_index < 1) {
      this.current_index++;
    } else {
      this.getPaginationBrandList();
    }
  }




  next_pagination() {
    this.current_index++;
    if(this.current_index > this.pagination.length) {
      this.current_index--;
    } else {
      this.getPaginationBrandList();
    }
  }





  getPaginationBrandList() {
    this.showLoader = true;
    
    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    }

    console.log('paginationPayload 2: ', paginationPayload);

    this.apiService.getModelList(paginationPayload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          // console.log('api responce customers list :...........', decrypted);
          if(decrypted.data.rows!== null && decrypted.data.rows.length > 0){
            this.subCategoryList = decrypted.data.rows;
            
            this.pagination.forEach(element => {
              element.active = false;
            });
            this.pagination[this.current_index - 1].active = true;

            // console.log('api responce vendors list :...........', this.customersList);
            this.showLoader = false;
          }else{
            this.showLoader = false;
            this.subCategoryList = [];
          }
        }else {
          this.showLoader = false;
          this.toaster.showError(decrypted.msg, 'Error!');
        }
      }     
    });
  }




  current_pagination(page_index) {
    this.current_index = page_index;
    this.getPaginationBrandList();
  }




  onMobileNumberType(e){
    // let modifiedName = e.target.value.replace(/[\d+`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      console.log('raw :', e.target.value);
      let num = e.target.value.match(/\d/g);
      if(num == null){
        e.target.value = '';
        this.createSubCategoryForm.patchValue({
          start_year: ''
        });
      }else{
        num = num.join("");
        num = num.toString();
        let trim = num.substring(0, 4);     
        e.target.value = trim;
        console.log(trim);      
        this.createSubCategoryForm.patchValue({
          start_year: trim
        });
      }      
  }




  onMobileNumberType2(e){
    // let modifiedName = e.target.value.replace(/[\d+`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      console.log('raw :', e.target.value);
      let num = e.target.value.match(/\d/g);
      if(num == null){
        e.target.value = '';
        this.createSubCategoryForm.patchValue({
          end_year: ''
        });
      }else{
        num = num.join("");
        num = num.toString();
        let trim = num.substring(0, 4);     
        e.target.value = trim;
        console.log(trim);      
        this.createSubCategoryForm.patchValue({
          end_year: trim
        });
      }      
  }


}
