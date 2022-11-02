import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";
import { environment } from "../../environments/environment";
import { ToasterService } from './toaster.service';
// import { HelpermethodsService } from 'src/app/services/helpermethods.service';

@Injectable({
  providedIn: 'root'
})
export class HelpermethodsService {

  // secret: string = "nPRCyH$3r0V1NwGm";
  fileData: File = null;
  image64: any = null;

  constructor(private toaster: ToasterService, private helper: HelpermethodsService) { }


  //-------------------------------------------------------------
  // encrypt data
  //-------------------------------------------------------------
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encrySecret).toString();
    } catch (e) {
      console.log(e);
    }
  }
  

  //-------------------------------------------------------------
  // de-crypt data
  //-------------------------------------------------------------
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.encrySecret);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }


  //-------------------------------------------------------------
  // getting and returning the image base64 data
  //-------------------------------------------------------------
  async imageProgress(fileInput: any) {
    let fileData = <File>fileInput.target.files[0];
    console.log('this.fileData : ....................', fileData);    
    let returnData = await this.preview(fileData);
    return returnData;
  }


  //-------------------------------------------------------------
  // converting image to base64
  //-------------------------------------------------------------
  async preview(fileData) {
    // Show preview 
    this.image64 = null;
    let mimeType = fileData.type;
    let arr = fileData.name.split('.');

    console.log('name array : ....................', arr);
    if (mimeType.match(/image\/*/) == null || fileData.size > 102400) {
      this.toaster.showError('Upload image within 100 KB', 'Error!');
      return;
    }else if(arr[1].toLowerCase() !== 'svg' && arr[1].toLowerCase() !== 'png' && arr[1].toLowerCase() !== 'jpg' && arr[1].toLowerCase() !== 'jpeg') {
      this.toaster.showError('Upload format should be PNG/JPG', 'Error!');
      return;
    }

    var reader = new FileReader();      
    reader.readAsDataURL(fileData); 
    
    return new Promise((resolve, reject)=>{
      reader.onload = (_event) => { 
        this.image64 = reader.result;       
        console.log('this.image64 ### :.................', this.image64);  
        if(this.image64){
          resolve(this.image64);
        }else{
          reject();
        }           
      }
    })
    
    // console.log('this.image64 ### return :.................', this.image64);
    // return this.image64;
  }



  //-------------------------------------------------------------
  // get local user data
  //-------------------------------------------------------------
  checkForUserData(){
    let localUserData = localStorage.getItem('user_data');
    // let localTokenData = localStorage.getItem('token');
    if(localUserData) {
      let userData = this.decryptData(localUserData);
      return userData;
    }else {
      return null;
    } 
  }



  //-------------------------------------------------------------
  // encrypt request data
  //-------------------------------------------------------------
  encryptDataFromRequest(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.encrySecretForRequest).toString();
    } catch (e) {
      console.log(e);
    }
  }



  //-------------------------------------------------------------
  //  decrypt responce data
  //-------------------------------------------------------------
  decryptResponceData(payload) {
    try {
        const bytes = CryptoJS.AES.decrypt(payload, environment.encrySecretForRequest);
        if (bytes.toString()) {
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return payload;
    } catch (e) {
        console.log(e);
    }
  }


}
