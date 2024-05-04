import { Component, OnInit } from '@angular/core';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalcamera',
  templateUrl: './modalcamera.page.html',
  styleUrls: ['./modalcamera.page.scss'],
})
export class ModalcameraPage implements OnInit {
  allphotos:Array<string> = [];
  cameraActive: boolean = false;

  constructor(private readonly modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.openCamera();
  }
  closeModal(action:number):void{
    this.stopCamera();
    if(action == 0)this.allphotos = [];
    this.modalCtrl.dismiss({
      'dismissed': true,
      "allphotos" : this.allphotos
    });
  }


  async openCamera():Promise<void>{
    this.allphotos = [];
    let cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: "cameraPreview",
      className: "cameraPreview",
      width: window.screen.width, //width of the camera display
      height: window.screen.height - 140, //height of the camera
      toBack: false
    };
    CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;
  }

  async stopCamera():Promise<void>{
    await CameraPreview.stop();
    this.cameraActive = false;
  }

  async takePicture():Promise<void>{
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 100
    };
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    let base64: string = `data:image/png;base64,${result.value}`;
    this.allphotos.push(base64);
    console.log(result)
    //this.closeModal(1);
  }
}
