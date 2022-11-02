import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import helpers from 'src/app/shared/common';
import { HelpermethodsService } from 'src/app/services/helpermethods.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  routeLink: string = 'dashboard';
  linkActive: Array<string> = [];
  public static sidebarcomponent;
  showSubCategory: Array<boolean> = [];
  showUserOption: boolean = false;

  constructor(
    private router: Router, 
    private cd: ChangeDetectorRef,
    private helper: HelpermethodsService,
    private toaster: ToasterService
    ) { 
    SidebarComponent.sidebarcomponent = this;
  }

  ngOnInit() {
    // console.log('helpers :........', helpers.getParticularRouterLinkName(0)); 
    // this.addActiveClassOnSideBarMenu(0);   
  }

  ngAfterViewInit(){
    this.cd.detectChanges();
  }

  onClickSideBarMenu(index){
    this.router.navigate([helpers.getParticularRouterLinkName(index)]);
  }

  addActiveClassOnSideBarMenu(i) {
    console.log('click value :..................', i); 

    this.linkActive = [];
    for (let index = 0; index < 7; index++) {
      if(i != index){
        this.linkActive[index] = '';
      }else{
        this.linkActive[index] = 'active';
      }            
    }

    // console.log(this.linkActive);
    this.showSubCategorys(i);  
    this.cd.detectChanges();  
  }

  showSubCategorys(num) {
    console.log('num...............', num);
    
    if(num === 2){
      if(this.showSubCategory[0]){
        this.showSubCategory[0] = false;
      }else{
        this.showSubCategory[0] = true;
      }      
    }else{
      this.showSubCategory[0] = false;
    } 
    this.cd.detectChanges();   
  }

  

  onCLickLogout() {
    // console.log('logout clciked'); 
    localStorage.clear();
    this.router.navigate(['login']);
    this.toaster.showSuccess('Logout Successfully', 'Success!');
  }



  getUserData() {
    // console.log('local user data : ', this.helper.checkForUserData());    
    return this.helper.checkForUserData();
  }


  gotoAdminProfileDetailsPage() {
    localStorage.setItem('profiledetailstype', 'admin');
    this.router.navigate(['/customer-details-admin/',this.getUserData().id]);
  }



  onClickArrow(){
    if(this.showUserOption){
      this.showUserOption = false;
    }else{
      this.showUserOption = true;
    }
  }

}
