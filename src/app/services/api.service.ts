import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {User} from "../model/user.model";
import {Observable} from "rxjs/index";
import {ApiResponse} from "../model/api.response";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  //-------------------------------------------------------------
  // all user registration api  
  //-------------------------------------------------------------
  usersRegistration(registrationPayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/register`, registrationPayload);
  }

  //-------------------------------------------------------------
  // admin login api  
  //-------------------------------------------------------------
  login(loginPayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/admin/login`, loginPayload);
  }

  //-------------------------------------------------------------
  // all users forgot password api  
  //-------------------------------------------------------------
  changePassword(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/forgotPassword`, payload);
  }

  //-------------------------------------------------------------
  // all users change password api  
  //-------------------------------------------------------------
  changeadminPassword(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/changePassword`, payload);
  }

  //-------------------------------------------------------------
  // all users verify otp api  
  //-------------------------------------------------------------
  verifyOtp(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/verifyOtp`, payload);
  }

  //-------------------------------------------------------------
  // create category api  
  //-------------------------------------------------------------
  createCategory(newCategoryPayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/category/create`, newCategoryPayload);
  }

  //-------------------------------------------------------------
  // create brand api  
  //-------------------------------------------------------------
  createBrand(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/brand/create`, payload);
  }
  
  //-------------------------------------------------------------
  // create model api  
  //-------------------------------------------------------------
  createModel(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/model/create`, payload);
  }

  //-------------------------------------------------------------
  // get model list  
  //-------------------------------------------------------------
  getModelList(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/model/list`, payload);
  }

  //-------------------------------------------------------------
  // category list api  
  //-------------------------------------------------------------
  getCategoryList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/category/list`);
  }

  //-------------------------------------------------------------
  // category list api  
  //-------------------------------------------------------------
  getCategoryListWithPagination(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/category/listwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // brand list api  
  //-------------------------------------------------------------
  getBrandList(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/brand/list`, payload);
  }

  //-------------------------------------------------------------
  // brand list api  
  //-------------------------------------------------------------
  getBrandAllList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/brand/allList`);
  }

  //-------------------------------------------------------------
  // subcategory create api  
  //-------------------------------------------------------------
  createSubCategory(newSubCategoryPayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subcategory/create`, newSubCategoryPayload);
  }

  //-------------------------------------------------------------
  // subcategory list api  
  //-------------------------------------------------------------
  getSubCategoryList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/subcategory/list`);
  }

  //-------------------------------------------------------------
  // subcategory list api  
  //-------------------------------------------------------------
  getSubCategoryListWithPagination(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subcategory/listwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // service create api  
  //-------------------------------------------------------------
  createService(newServicePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/service/create`, newServicePayload);
  }

  //-------------------------------------------------------------
  // service list api  
  //-------------------------------------------------------------
  getServiceList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/service/list`);
  }

  //-------------------------------------------------------------
  // service list api  
  //-------------------------------------------------------------
  getServiceListWithPagination(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/service/listwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // getting sub-category by category id api  
  //-------------------------------------------------------------
  getSubCategoryByCategoryId(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subcategory/getSubCategoryByCategoryId`, payload);
  }

  //-------------------------------------------------------------
  // category update api  
  //-------------------------------------------------------------
  updateCategory(updateCategoryPayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/category/update`, updateCategoryPayload);
  }

  //-------------------------------------------------------------
  // category update api  
  //-------------------------------------------------------------
  updateBrand(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/brand/update`, payload);
  }

  //-------------------------------------------------------------
  // category update api  
  //-------------------------------------------------------------
  updateModel(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/model/update`, payload);
  }

  //-------------------------------------------------------------
  // sub-category update api  
  //-------------------------------------------------------------
  updateSubCategory(updateSubCategoryPayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subcategory/update`, updateSubCategoryPayload);
  }

  //-------------------------------------------------------------
  // service update api  
  //-------------------------------------------------------------
  updateService(updateServicePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/service/update`, updateServicePayload);
  }

  //-------------------------------------------------------------
  // category delete api  
  //-------------------------------------------------------------
  deleteCategory(deletePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/category/delete`, deletePayload);
  }

  //-------------------------------------------------------------
  // category delete api  
  //-------------------------------------------------------------
  deleteBrand(deletePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/brand/delete`, deletePayload);
  }

  //-------------------------------------------------------------
  // category delete api  
  //-------------------------------------------------------------
  deleteModel(deletePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/model/delete`, deletePayload);
  }

  //-------------------------------------------------------------
  // sub-category delete api  
  //-------------------------------------------------------------
  deleteSubCategory(deletePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/subcategory/delete`, deletePayload);
  }

  //-------------------------------------------------------------
  // service delete api  
  //-------------------------------------------------------------
  deleteService(deletePayload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/service/delete`, deletePayload);
  }

  //-------------------------------------------------------------
  // vendor list api  
  //-------------------------------------------------------------
  getVendorList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/vendor/list`);
  }

  //-------------------------------------------------------------
  // vendor list api  
  //-------------------------------------------------------------
  getApprovedVendorList(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor/listapprovedwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // vendor list api  
  //-------------------------------------------------------------
  getNonApprovedVendorList(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/vendor/listnonapprovedwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // customer list api  
  //-------------------------------------------------------------
  getCustomerList(payload) : Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/user/list`, payload);
  }

  //-------------------------------------------------------------
  // get particular user data  
  //-------------------------------------------------------------
  getCustomerDetails(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/user/get-details`, payload);
  }

  //-------------------------------------------------------------
  // get particular user data  
  //-------------------------------------------------------------
  getAdminDetails(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/user/get-details-admin`, payload);
  }

  //-------------------------------------------------------------
  // get particular vendor data  
  //-------------------------------------------------------------
  getVendorDetails(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/user/get-vendor-details`, payload);
  }

  //-------------------------------------------------------------
  // get all state list data  
  //-------------------------------------------------------------
  getAllStateList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/state/list`);
  }

  //-------------------------------------------------------------
  // get all jobs list data  
  //-------------------------------------------------------------
  getAllJobsList() : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseUrl}/jobs/list`);
  }

  //-------------------------------------------------------------
  // get all jobs list data  
  //-------------------------------------------------------------
  getAllJobsListWithPagination(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/listwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // get all jobs list data for customer 
  //-------------------------------------------------------------
  getAllJobsListByUser(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobsbyuser`, payload);
  }

  //-------------------------------------------------------------
  // get all jobs list data for customer 
  //-------------------------------------------------------------
  getAllJobsListByUserwithPagination(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobsbyuserwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // get all jobs list data for customer 
  //-------------------------------------------------------------
  getAllJobsListByVendor(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobsbyvendor`, payload);
  }

  //-------------------------------------------------------------
  // get all jobs list data for customer 
  //-------------------------------------------------------------
  getAllJobsListByVendorWithPagination(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobsbyvendorwithpagination`, payload);
  }

  //-------------------------------------------------------------
  // vendor approve api 
  //-------------------------------------------------------------
  vendorApprove(payload) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseUrl}/users/update`, payload);
  }


  getBookingDetails(payload) : Observable<ApiResponse> {
    //console.log(`${environment.baseUrl}/user/get-details`);
    return this.http.post<ApiResponse>(`${environment.baseUrl}/jobs/getjobbyid`, payload);
  }
}
