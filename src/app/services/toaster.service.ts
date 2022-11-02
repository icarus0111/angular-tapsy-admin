import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  toastConfig: object = {
    timeOut: 6000,
    progressBar: true,
  }

  constructor(private toastr: ToastrService) { }

  //-------------------------------------------------------------
  // success toast msg method
  //-------------------------------------------------------------
  showSuccess(message, title) {
    this.toastr.success(message, title, this.toastConfig);
  }

  //-------------------------------------------------------------
  // error toast msg method
  //-------------------------------------------------------------
  showError(message, title) {
    this.toastr.error(message, title, this.toastConfig);
  }

  //-------------------------------------------------------------
  // show alert method
  //-------------------------------------------------------------
  async showConfirmationAlert(title, text, type) {
    
      return Swal.fire({
        title,
        text,
        type,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        // console.log('alert action value :.................', result);  
        return result;    
        // if (result.value) {
          // Swal.fire(
          //   'Deleted!',
          //   'Your imaginary file has been deleted.',
          //   'success'
          // )
        // } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Swal.fire(
          //   'Cancelled',
          //   'Your imaginary file is safe :)',
          //   'error'
          // )
        // }
      })    
  }


  
}
