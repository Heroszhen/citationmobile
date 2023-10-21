import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
import * as aws from "aws-sdk";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.page.html',
  styleUrls: ['./cloud.page.scss'],
})
export class CloudPage implements OnInit {
  folder:aws.S3.ObjectList | undefined;
  constructor(private ts: TestService, private router: Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
     if (environment.production)this.router.navigate(["/"]);
  }
  ionViewDidEnter() {
    if (!environment.production) {
      this.getCloud();
    }
  }

  async getCloud(): Promise<void> {
    this.folder = await this.ts.getCloud();
  }

  

}
