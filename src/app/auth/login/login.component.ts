import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  showLoader: boolean = false;
  assetLink: string = environment.linkToAsset;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService) { }

  ngOnInit() {
    this.initializeLoginForm();
  }


  initializeLoginForm(){
    // window.localStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])]
    });
  }


  onSubmitLoginForm() {
    this.showLoader = true;
    console.log('form value :..........', this.getLoginFormValue());
    if (this.loginForm.invalid) {
      this.showLoader = false;
      return;
    }

    const loginPayload = {
      username: this.getLoginFormValue().username,
      password: this.getLoginFormValue().password
    }

    // const encryptedRequestData = {
    //   TAP_REQ: this.helper.encryptDataFromRequest(loginPayload)
    // }

    this.apiService.login(loginPayload).subscribe((data: any) => {
      console.log('api responce :...........', data); 

        if(data && data.TAP_RES){
          let decrypted = this.helper.decryptResponceData(data.TAP_RES);
          console.log('decrypted data :..............................', decrypted);        
          if(decrypted.status) {        
            let encryptedData = this.helper.encryptData(decrypted.data);
            let encryptedToken = this.helper.encryptData(decrypted.token);
            localStorage.setItem('user_data', encryptedData);
            localStorage.setItem('token', encryptedToken);
            this.toaster.showSuccess(decrypted.msg, 'Success!');
            this.showLoader = false;
            this.router.navigate(['dashboard']);
          }else {
            this.showLoader = false;
            this.toaster.showError(decrypted.msg, 'Error!');
          }
        }
    });
  }



  // if(data && data.TAP_RES){
  //   let decrypted = this.helper.decryptResponceData(data.TAP_RES);
  //   console.log('decrypted data :..............................', decrypted);        
  //   if(decrypted.status) {        
  //     let encryptedData = this.helper.encryptData(decrypted.data);
  //     let encryptedToken = this.helper.encryptData(data.token);
  //     localStorage.setItem('user_data', encryptedData);
  //     localStorage.setItem('token', encryptedToken);
  //     this.toaster.showSuccess(data.msg, 'Success!');
  //     this.showLoader = false;
  //     this.router.navigate(['dashboard']);
  //   }else {
  //     this.showLoader = false;
  //     this.toaster.showError(data.msg, 'Error!');
  //   }
  // }


  disableLoginSubmitBtn() {
    if(this.loginForm.valid){
      return false;
    }else{
      return true;
    }
  }


  getLoginFormValue() {
    return this.loginForm.value;
  }


  usernameErrors() {
    return this.loginForm.controls.username.errors;
  }


  passwordErrors() {
    return this.loginForm.controls.password.errors;
  }


  goToForgotPassword(){
    this.router.navigate(['forgot-password']);
  }

}
