import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  invalidLogin: boolean = false;
  assetLink: string = environment.linkToAsset;
  showLoader: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService) { }

  ngOnInit() {
    this.initializeLoginForm();
  }


  initializeLoginForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(60), Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)])],
      old_password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(25)])],
      new_password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(25)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(25)])]
    }, {validator: this.checkPasswords });
  }


  disableLoginSubmitBtn() {
    if(this.forgotPasswordForm.valid){
      return false;
    }else{
      return true;
    }
  }


  getFormValue() {
    return this.forgotPasswordForm.value;
  }


  emailErrors() {
    return this.forgotPasswordForm.controls.email.errors;
  }


  oldPasswordErrors() {
    return this.forgotPasswordForm.controls.old_password.errors;
  }

  newPasswordErrors() {
    return this.forgotPasswordForm.controls.new_password.errors;
  }


  confirmPasswordErrors() {
    return this.forgotPasswordForm.controls.confirm_password.errors;
  }


  onSubmitChangePasswordForm() {
    this.showLoader = true;
    console.log('form value :..........', this.getFormValue());

    let encryptedData = this.helper.encryptData(this.getFormValue());
    localStorage.setItem('P_Cha_Data', encryptedData);

    let payload = this.getFormValue();

    console.log('change password payload data : ', payload);    

    this.apiService.changeadminPassword(payload).subscribe((data: any) => {
      if(data && data.TAP_RES){
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('change password data :..............................', decrypted);

        if(decrypted.status) {
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          // this.router.navigate(['verify-otp']);
          this.onCLickLogout();
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }

      }else{
        this.toaster.showError('Server not responding', 'Error!');
        this.showLoader = false;
      }
      // console.log('change password api responce :...........', data);     
    }, error => {
      this.toaster.showError('Server not responding', 'Error!');
      this.showLoader = false;
    });
  }



  onCLickLogout() {
    console.log('logout clciked'); 
    localStorage.clear();
    this.router.navigate(['/login']);
  }



  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('new_password').value;
    let confirmPass = group.get('confirm_password').value;
    return pass === confirmPass ? null : { notSame: true }     
  }

  // MustMatch('password', 'confirmPassword')

}
