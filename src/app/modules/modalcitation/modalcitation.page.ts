import { Component, Input, OnInit } from '@angular/core';
import { ICitation, IDataCitation, IDataComments } from 'src/app/interfaces/general';
import { ModalController, ScrollDetail } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-modalcitation',
  templateUrl: './modalcitation.page.html',
  styleUrls: ['./modalcitation.page.scss'],
})
export class ModalcitationPage implements OnInit {
  @Input() citationId:string;
  citation:ICitation;
  comments:Array<Comment> = [];
  commentPageItem:number = 1;
  canCharge:boolean = true;

  constructor(
    private modalCtr: ModalController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    
  }

  ionViewDidEnter(){
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

}
