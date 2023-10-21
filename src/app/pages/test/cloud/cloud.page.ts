import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
import * as aws from "aws-sdk";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { wait} from 'src/app/utils/generalUtil';
import { LoadingController } from '@ionic/angular';

interface IFolder {
  Key:string,
  LastModified: string
  Size:number
}

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.page.html',
  styleUrls: ['./cloud.page.scss'],
})
export class CloudPage implements OnInit {
  folder:aws.S3.ObjectList = [];
  isModalOpen:boolean = false;
  elmIndex:number|null = null;
  mimeType?:string;
  signedUrl:string = "";

  constructor(
    private ts: TestService, 
    private router: Router,
    private readonly loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
     if (environment.production)this.router.navigate(["/"]);
  }

  ionViewDidEnter() {
  }

  async getCloud(): Promise<void> {
    this.folder = [];
    const loading = await this.loadingCtrl.create({
      spinner: "circles"
    });
    loading.present();
    await wait(2);
    loading.dismiss();
    this.folder = (await this.ts.getCloud()) ?? [];
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen)this.elmIndex = null;
  }

  async viewFile(index:number): Promise<void> {
    if(!this.folder[index]['Key']?.endsWith('/')) {
      this.mimeType = (await this.ts.getHead(this.folder[index]['Key'] as string)).ContentType
      this.signedUrl = await this.ts.getSignedUrl(this.folder[index]['Key'] as string);
      this.elmIndex = index;
      this.setOpen(true);
    }
  }

}
