import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';

declare var Circles: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tapsy-admin';

  constructor(private dSL: DynamicScriptLoaderService) { }

  ngOnInit() {
    this.loadScripts();
  }

  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dSL.load('jquery', 'popper', 'bootstrapjs', 'webfont', 'chartcircle', 'jqueryui', 'jqueryuitouchpunch', 'atlantis', 'settingdemo', 'demo', 'datatables').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }


}

// "node_modules/jquery/dist/jquery.min.js",
// "src/assets/js/core/popper.min.js"
