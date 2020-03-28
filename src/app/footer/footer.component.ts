import { Component, OnInit } from '@angular/core';
import {HelperService} from '../shared/helper.service';
import {AppHealth} from '../shared/app-health';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  backendStatus = 'LOADING';

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this.getAppInfo();
  }

  private getAppInfo() {
    this.helperService.appHealth()
      .subscribe(
        (appInfo: AppHealth) => {
          console.log(appInfo);
          this.backendStatus = appInfo.status;
        },
        error => {
          console.log(error);
          this.backendStatus = 'DOWN';
        }
      );
  }
}
