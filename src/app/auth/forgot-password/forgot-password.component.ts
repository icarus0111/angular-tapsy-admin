import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

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
      new_password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(15)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(15)])]
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


  newPasswordErrors() {
    return this.forgotPasswordForm.controls.new_password.errors;
  }


  confirmPasswordErrors() {
    return this.forgotPasswordForm.controls.confirm_password.errors;
  }


  onSubmitChangePasswordForm() {
    this.showLoader = true;
    // console.log('form value :..........', this.getFormValue());

    let encryptedData = this.helper.encryptData(this.getFormValue());
    localStorage.setItem('P_Cha_Data', encryptedData);

    let payload = this.getFormValue();
    console.log('payload :..........', payload);

    this.apiService.changePassword(payload).subscribe((data: any) => {
      if(data && data.TAP_RES){
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('forgot password data :..............................', decrypted);

        if(decrypted.status) {
          this.router.navigate(['verify-otp']);
          this.showLoader = false;
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
          this.showLoader = false;
        }

      }else{
        this.toaster.showError('Server not responding', 'Error!');
        this.showLoader = false;
      }    
      
    }, error => {
      this.showLoader = false;
      this.toaster.showError('Server not responding', 'Error!');
    });
  }



  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('new_password').value;
    let confirmPass = group.get('confirm_password').value;
    return pass === confirmPass ? null : { notSame: true }     
  }

  // MustMatch('password', 'confirmPassword')

}
