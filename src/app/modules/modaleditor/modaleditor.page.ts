import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Citation } from 'src/app/models/citation';
import { readFile } from 'src/app/utils/generalUtil';
import { ModalController } from '@ionic/angular';

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
  citationM:Citation = new Citation();
  file:File|null = null;
  fileUrl:string = "";
  videoUrl:string = "";
  videoType:number = 0;
  imageSection:boolean = false;
  videoSection:boolean = false;
  @ViewChild('inputfile') inputFile: ElementRef<HTMLInputElement>;

  constructor(private modalCtr: ModalController) {}

  ngOnInit(): void {
    if (this.citation !== undefined) {
      this.citationM.assignData(this.citation);
      if (this.citationM['video'] !== null) {
        this.videoSection = true;
      }
    }
  }

  logChange(e:any): void{
    console.log(e)
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
    console.log(this.citationM, this.videoUrl, this.videoType)
  }

  closeModal(): void {
    this.modalCtr.dismiss({
      'dismissed': true
    });
  }
}