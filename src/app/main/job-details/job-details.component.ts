import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {

  jobId: any;
  showLoader: boolean = false;
  id: any;
  booking_details: any;
  details: any;

  constructor(
    private activatedRoute:  ActivatedRoute,
    private apiService: ApiService,
    private helper: HelpermethodsService,
  ) {
    this.jobId =  this.activatedRoute.snapshot.params.id;
   }




  ngOnInit() {
    this.getBookingDetails();
  }





  getBookingDetails() {
    this.showLoader = true;

    let payload = {
      id: this.jobId
    }

    this.apiService.getBookingDetails(payload).subscribe(async (data: any) => {
      if(data && data.TAP_RES) {
        let decrypted = this.helper.decryptResponceData(data.TAP_RES);

        if(decrypted.status) {
          this.booking_details = decrypted.data[0];
          if(decrypted.data[0].details) {
            this.details = JSON.parse(decrypted.data[0].details);
          }
          console.log('booking details data :.....', this.booking_details);
          this.showLoader = false;

        } else {
          this.showLoader = false;
          // const alert = await this.alert.presentAlertConfirm('Alert!', decrypted.msg);
          // alert.present();
        }
      } 
    }, async (error) =>{
      this.showLoader = false;
      // const alert = await this.alert.presentAlertConfirm('Alert!', 'Something went wrong.');
      // alert.present();
    })
  }




}
