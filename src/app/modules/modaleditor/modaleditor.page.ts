import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Citation } from 'src/app/models/citation';
import { readFile } from 'src/app/utils/generalUtil';
import { ModalController } from '@ionic/angular';
import { StoreService } from 'src/app/services/store.service';
import { ApiService } from 'src/app/services/api.service';
import { ICitation, IDataCitation } from 'src/app/interfaces/general';
import { ModalcameraPage } from '../modalcamera/modalcamera.page';

@Component({
  selector: 'app-modaleditor',
  templateUrl: './modaleditor.page.html',
  styleUrls: ['./modaleditor.page.scss'],
})
export class ModaleditorPage implements OnInit {

  @Input() modules:any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };
  @Input() citation:Citation|undefined;
  //1:add, 2:update
  @Input() action:number|undefined; 
  citationM:Citation = new Citation();
  file:File|null = null;
  fileUrl:string = "";
  videoUrl:string = "";
  videoType:number = 0;
  imageSection:boolean = false;
  videoSection:boolean = false;
  @ViewChild('inputfile') inputFile: ElementRef<HTMLInputElement>;
  @ViewChild('inputcamerafile') inputCameraFile: ElementRef<HTMLInputElement>;
  platform:string = "";
  message:string = "";
  response:ICitation|null = null;
  disabledButton:boolean = false;

  constructor(
    private modalCtr: ModalController,
    private readonly storeService: StoreService,
    private readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.platform = this.storeService.platform$.getValue()[0];
    if (this.citation !== undefined) {
      this.citationM.assignData(this.citation);
      if (this.citationM['video'] !== null) {
        this.videoSection = true;
      }
    }
  }

  logChange(e:any): void{

  }

  async handleFile(target:EventTarget|null): Promise<void>{
    if (target !== null) {
      let files:FileList|null =  (target as HTMLInputElement).files;
      if (files !== null) {
        if (files.item(0)?.type.includes('image')) {
          this.file = files.item(0);
          if (this.file !== null)this.fileUrl = await readFile(this.file);
        }
      }
    }
  }

  editCitation(): void {
    this.disabledButton = true;

    let formD = new FormData();
    formD.append('_id', this.citationM["_id"]);
    formD.append('message', this.citationM["message"]);
    if (this.file !== null)formD.append('file', this.file);
    if (this.videoUrl !== '' && this.videoType !== 0) {
      formD.append('videoUrl', this.videoUrl);
      formD.append('videoType', this.videoType.toString());
    }
    this.apiService.postEditCitation(formD).subscribe({
      next: (data:IDataCitation)=>{
        if (data["status"] === 1) {
          this.response = {
            "citation": data["data"]["citation"],
            "nbComments": data["data"]["nbComments"]
          };
          if (this.action === 1) {
            this.closeModal();
          }
          this.disabledButton = false;
        }
      },
      error:(err)=>{this.disabledButton = false;}
    });
  }

  closeModal(): void {
    this.modalCtr.dismiss({
      'dismissed': true,
      'citation': this.response,
      'action': this.action
    });
  }

  async openModalCamera(): Promise<void> {
    const modal = await this.modalCtr.create({
      component: ModalcameraPage,
      cssClass: 'modalstyle',
      componentProps: {
        // 'citationId': this.citations[this.elmIndex]["citation"]["_id"],
        // 'user': this.user
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
      }
    });

    await modal.present();
  }
}
