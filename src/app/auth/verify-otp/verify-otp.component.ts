import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {

  verifyOtpForm: FormGroup;
  invalidLogin: boolean = false;
  assetLink: string = environment.linkToAsset;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private helper: HelpermethodsService, private toaster: ToasterService) { }

  ngOnInit() {
    this.initializeLoginForm();
  }



  initializeLoginForm() {
    this.verifyOtpForm = this.formBuilder.group({
      otp: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])]
    });
  }


  disableSubmitBtn() {
    if(this.verifyOtpForm.valid){
      return false;
    }else{
      return true;
    }
  }


  getFormValue() {
    return this.verifyOtpForm.value;
  }


  otpErrors() {
    return this.verifyOtpForm.controls.otp.errors;
  }



  async onSubmitVerifyOtpForm() {
    console.log('form value :..........', this.getFormValue());
    let passData = await this.getPasswordData();
    
    let payload = {
      otp: this.getFormValue().otp,
      ...passData 
    }

    this.apiService.verifyOtp(payload).subscribe((data: any) => {
      console.log('api responce :...........', data); 
      if(data && data.TAP_RES){
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);
        console.log('decrypted data :..............................', decrypted);

        if(decrypted.status) {
          this.toaster.showSuccess(decrypted.msg, 'Success!');
          this.onCLickLogout();
          this.router.navigate(['/login']);
        }else {
          this.toaster.showError(decrypted.msg, 'Error!');
        }

      }else{
        this.toaster.showError('Server not responding', 'Error!');
      }     
      
    });
  }



  onCLickLogout() {
    console.log('logout clciked'); 
    localStorage.clear();
    this.router.navigate(['/login']);
  }



  async getPasswordData() {
    let localUserData = localStorage.getItem('P_Cha_Data');    
    if(localUserData) {
      let userData = this.helper.decryptData(localUserData);
      return userData;
    }else{
      return null;
    }
  }

}
