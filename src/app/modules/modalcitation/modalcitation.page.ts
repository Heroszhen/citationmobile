import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ICitation, IData, IDataCitation, IDataComment, IDataComments, IUser } from 'src/app/interfaces/general';
import { LoadingController, ModalController, ScrollDetail } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Comment } from 'src/app/models/comment';
import editor_toolbar from "../../../assets/files/editor_toolbar.json";
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-modalcitation',
  templateUrl: './modalcitation.page.html',
  styleUrls: ['./modalcitation.page.scss'],
})
export class ModalcitationPage implements OnInit {
  @Input() user:IUser|null = null;
  @Input() citationId:string;
  citation:ICitation;
  comments:Array<Comment> = [];
  commentPageItem:number = 1;
  canCharge:boolean = true;
  commentM:Comment = new Comment();
  modules:any = {
    toolbar: editor_toolbar.toolbar_complete
  };
  isCommentModalOpen = false;
  loader:any = null;

  constructor(
    private modalCtr: ModalController,
    private apiService: ApiService,
    private storeService: StoreService,
    private readonly loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    
  }

  async ionViewDidEnter() {
    this.loader = await this.loadingCtrl.create({
      spinner: "circles"
    });
    this.apiService.getGetCitation(this.citationId).subscribe({
      next: (data:IDataCitation)=>{
        if (data["status"] === 1 && data["data"] !== null) {
          this.citation = data["data"];
        }
      },
      error:(err)=>{}
    });

    this.getComments();
  }

  getComments(): void {
    this.canCharge = false;
    this.apiService.getGetCommentsByCitation(this.citationId, this.commentPageItem).subscribe({
      next: (data:IDataComments)=>{
        if (data["status"] === 1 && data["data"] !== null && data["data"].length !== 0) {
          this.comments = this.comments.concat(data["data"]);
          this.commentPageItem++;
        }
        this.canCharge = true;
      },
      error:(err)=>{this.canCharge = true;}
    });
  }

  async handleScroll(event: CustomEvent<ScrollDetail>): Promise<void> {
    let scrollTop:number = event.detail.scrollTop;
    let scrollHeight:number = (event.target as HTMLElement).scrollHeight;
    let listCitations:HTMLElement = document.querySelector("#modalcitation-content") as HTMLElement;
    if (scrollTop + scrollHeight >= listCitations.offsetHeight && this.canCharge) {
      this.getComments();
    }
  }

  closeModal(): void {
    this.modalCtr.dismiss({
      'dismissed': true
    });
  }

  setIsCommentModalOpen(b:boolean): void {
    if (b) {
      this.commentM = new Comment();
    } else {

    }
    this.isCommentModalOpen = b;
  }

  editComment(): void {
    this.loader.present();
    this.apiService.postEditComment(this.citationId, this.commentM).subscribe({
      next: (data:IDataComment)=>{
        this.loader.dismiss();
        if (data["status"] === 1 && data["data"] !== null) {
          if (this.commentM['_id'] === '') {
            this.comments.unshift(data["data"]);
            this.setIsCommentModalOpen(false);
          }
        }
      },
      error:(err)=>{this.loader.dismiss();}
    });
  }

  deleteComment(index:number): void {
    this.loader.present();
    this.apiService.deleteDeleteComment(this.comments[index]['_id']).subscribe({
      next: (data:IData)=>{
        this.loader.dismiss();
        if (data["status"] === 1) {
          this.comments.splice(index, 1);
        }
      },
      error:(err)=>{this.loader.dismiss();}
    });
  }
}
