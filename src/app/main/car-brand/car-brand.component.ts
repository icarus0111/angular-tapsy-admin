import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-car-brand',
  templateUrl: './car-brand.component.html',
  styleUrls: ['./car-brand.component.css']
})
export class CarBrandComponent implements OnInit {

  createCategoryForm: FormGroup;
  fileData: File = null;
  imagebase64: any = null;
  showCategoryForm: boolean = false;
  categoryList: Array<object>;
  baseImageUrl: string = environment.baseImageUrl;
  updateCategoryId: number;
  showAddBtn: boolean = true;
  showLoader: boolean = false;
  selectedImage: any = null;

  max_customer_show: number = 10;
  current_index: number = 1;
  pagination: any = [];

  constructor(private dSL: DynamicScriptLoaderService, private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService, private http: HttpClient) { }

  ngOnInit() {
    this.loadScripts();
    SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(2);
    this.initializeForm();
    this.getBrandList();
  }


  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dSL.load('datatables').then(data => {
      // Script Loaded Successfully
      // this.createCircleChart();
    }).catch(error => console.log(error));
  }



  initializeForm(){
    // window.localStorage.removeItem('token');
    this.createCategoryForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      // category_icon: [null, Validators.compose([])]
    });
  }



  disableSubmitBtn() {
    if(this.createCategoryForm.valid){
      return false;
    }else{
      return true;
    }
  }


  getFormValue() {
    return this.createCategoryForm.value;
  }


  // async fileProgress(fileInput: any) {
  //   this.imagebase64 = await this.helper.imageProgress(fileInput);
  //   console.log('image 64 convert success : .............', this.imagebase64);   
  //   if(this.imagebase64 == '' || this.imagebase64 == undefined){
  //     this.imagebase64 = null;
  //     this.createCategoryForm.patchValue({
  //       category_icon: null
  //     });
  //   } 
  // }



  async fileProgress(fileInput: any) {
    // this.imagebase64 = await this.helper.imageProgress(fileInput);
    // console.log('image 64 convert success : .............', this.imagebase64);   
    // if(this.imagebase64 == '' || this.imagebase64 == undefined){
    //   this.imagebase64 = null;
    //   this.createCategoryForm.patchValue({
    //     category_icon: null
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
 
      this.http.post(`${environment.baseUrl}/brand/uploadImage`, formData).subscribe((res: any)=>{
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


  // preview() {
  //   // Show preview 
  //   let mimeType = this.fileData.type;
  //   let arr = this.fileData.name.split('.');
  //   // console.log('name array : ....................', arr);
  //   if (mimeType.match(/image\/*/) == null || this.fileData.size > 102400) {
  //     this.toaster.showError('Upload image within 100 KB', 'Error!');
  //     return;
  //   }else if(arr[1].toLowerCase() !== 'png' && arr[1].toLowerCase() !== 'jpg' && arr[1].toLowerCase() !== 'jpeg') {
  //     this.toaster.showError('Upload format should be PNG/JPG', 'Error!');
  //     return;
  //   }

  //   var reader = new FileReader();      
  //   reader.readAsDataURL(this.fileData); 
  //   reader.onload = (_event) => { 
  //     this.imagebase64 = reader.result; 
  //     // console.log('this.previewUrl :.................', this.imagebase64);      
  //   }
  // }



  openCategoryForm(){
    // console.log('open form'); 
    this.createCategoryForm.reset();   
    this.showCategoryForm = true;
    this.showAddBtn = true;
  }



  closeCategoryForm(){
    // console.log('close form'); 
    this.createCategoryForm.reset();   
    this.showCategoryForm = false;
  }



  onSubmitCreateCategoryForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    if (this.createCategoryForm.invalid) {
      this.showLoader = false;
      return;
    }

    const payload = {
      name: this.getFormValue().name,
      logo: this.selectedImage
    }

    console.log('brand add payload :...........', payload);
    this.showCategoryForm = false;

    this.apiService.createBrand(payload).subscribe((data: any) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        if(decrypted.status) {          
          this.getBrandList();
          this.createCategoryForm.reset();
          this.imagebase64 = null;
          this.selectedImage = null;
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }      
    });
  }



  getBrandList(){
    this.current_index = 1;
    this.showLoader = true;

    let paginationPayload = {
      limit: this.max_customer_show,
      page: this.current_index
    }

    this.apiService.getBrandList(paginationPayload).subscribe((data: any) => {   
      console.log('api responce category list :...........', data);  
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('get Brand List :..............................', decrypted.data);
        if(decrypted.status) {
          if(decrypted.data !== null && decrypted.data.rows.length > 0){
            this.categoryList = decrypted.data.rows; 
            console.log('get Brand Lists :..............................', this.categoryList);
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
            this.categoryList = [];
            this.showLoader = false;
          }
        }else {
          this.toaster.showError(decrypted.message, 'Error!');
          this.showLoader = false;
        }
      }     
    });
  }


  getCategoryFormErrors() {
    return this.createCategoryForm.controls;
  }


  onClickEditCategory(category_data){
    console.log('category id :...................', category_data);     
    this.updateCategoryId = category_data.id;
    this.createCategoryForm.patchValue({
      name: category_data.name
    });
    this.showAddBtn = false;
    this.showCategoryForm = true;
  }


  onSubmitupdateCategoryForm(){
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());
    if (this.createCategoryForm.invalid) {
      this.showLoader = false;
      return;
    }

    const updateCategoryPayload = {
      id: this.updateCategoryId,
      name: this.getFormValue().name,
      logo: this.selectedImage
    }

    this.showCategoryForm = false;
    console.log('category update payload :...........', updateCategoryPayload);

    this.apiService.updateBrand(updateCategoryPayload).subscribe((data: any) => {
      // console.log('api responce :...........', data);
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        // console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {          
          this.getBrandList();
          this.createCategoryForm.reset();
          this.imagebase64 = null;
          this.selectedImage = null;
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.showLoader = false;
        } else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }
      }      
    });
  }




  async openAlert(id){
    
    let result = await this.toaster.showConfirmationAlert('Are you sure ?', '', 'warning');
    // console.log('alert action value :.................', result); 
    if(result.value){
      this.showLoader = true;
      let payload = {id};
      this.apiService.deleteBrand(payload).subscribe((data: any) => {
        if(data && data.TAP_RES) {
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
          // console.log('decrypted data :..............................', decrypted);
          if(decrypted.status) {
            this.getBrandList();
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

    this.apiService.getBrandList(paginationPayload).subscribe((data: any) => { 
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);
        if(decrypted.status) {
          console.log('api responce customers list :...........', decrypted);
          if(decrypted.data.rows!== null && decrypted.data.rows.length > 0){
            this.categoryList = decrypted.data.rows;
            
            this.pagination.forEach(element => {
              element.active = false;
            });
            this.pagination[this.current_index - 1].active = true;

            // console.log('api responce vendors list :...........', this.customersList);
            this.showLoader = false;
          }else{
            this.showLoader = false;
            this.categoryList = [];
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

  

}
