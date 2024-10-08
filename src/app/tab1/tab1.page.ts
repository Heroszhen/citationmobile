import { Component, OnInit } from '@angular/core';
import { ICitation, IData, IDataCitations, IUser } from '../interfaces/general';
import { Subscription } from 'rxjs';
import { StoreService } from '../services/store.service';
import { ApiService } from '../services/api.service';
import { LoadingController, ScrollDetail } from '@ionic/angular';
import { ModaleditorPage } from '../modules/modaleditor/modaleditor.page';
import { ModalController } from '@ionic/angular';
import { ModalcitationPage } from '../modules/modalcitation/modalcitation.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  subscribers: Subscription[] = [];
  user:IUser|null = null;

  pageItem:number = 1;
  keywords:string = "";
  citations:ICitation[] = [];
  canCharge:boolean = true;
  citationsSubscriber:Subscription|null = null;
  modal:boolean = false;
  elmIndex:number = -1;
  modules = {
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
    ]
  };
  loader:any = null;

  constructor(
    private readonly storeService:StoreService,
    private readonly apiService:ApiService,
    private readonly loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter(): Promise<void> {
    this.loader = await this.loadingCtrl.create({
      spinner: "circles"
    });
    this.pageItem = 1;
    this.keywords = "";
    this.citations = [];

    let subscriberUser:Subscription = this.storeService.user$.subscribe((data:Array<IUser|null>) => {
      this.user = data[0];
    });

    let subscriberServer:Subscription = this.storeService.isServerFree$.subscribe((data:Array<Boolean>) => {
      if (data[0]) {
        this.getCitations();
      }
    });

    this.subscribers.push(subscriberUser, subscriberServer);
  }

  ionViewDidEnter(){}

  ionViewWillLeave(){}

  ionViewDidLeave(): void {
    for (let entry of this.subscribers) entry.unsubscribe();
  }

  async getCitations(): Promise<void> {
    this.canCharge = false;
    this.citationsSubscriber = this.apiService.getGetCitations(this.pageItem, this.keywords).subscribe({
      next: (data:IDataCitations)=>{
        if (data["status"] === 1) {
          if (data["data"].length !== 0) {
            this.pageItem++;
            this.citations = this.citations.concat(data["data"]);
          }
        }
        this.canCharge = true;
      },
      error:(err)=>{
       this.canCharge = true;
      }
    });
  }

  async searchByKeywords(): Promise<void> {
    this.citationsSubscriber?.unsubscribe();
    this.citations = [];
    this.pageItem = 1;
    await this.getCitations();
  }

  async clearKeywords(): Promise<void> {
    if (this.keywords !== "") {
      this.pageItem = 1;
      this.keywords = "";
      this.citations = [];
      await this.getCitations();
    }
  }

  async handleScroll(event: CustomEvent<ScrollDetail>): Promise<void> {
    let scrollTop:number = event.detail.scrollTop;
    let scrollHeight:number = (event.target as HTMLElement).scrollHeight;
    let listCitations:HTMLElement = document.querySelector(".list-citations") as HTMLElement;
    if (scrollTop + scrollHeight - 80 >= listCitations.offsetHeight && this.canCharge) {
      await this.getCitations()
    }
  }

  handleRefresh(event:any): void {
    setTimeout(async () => {
      event.target.complete();
      if (this.canCharge) {
        this.citations = [];
        this.pageItem = 1;
        await this.getCitations()
      }
    }, 1000);
  }

  async presentModal(e: Event): Promise<void>{
    const modal = await this.modalCtrl.create({
      component: ModaleditorPage,
      cssClass: 'modalstyle',
      componentProps: {
        'modules': this.modules,
        'action': 1
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        if (data.data.citation !== null) {
          if (data.data.action === 1) {
            this.citations.unshift(data.data.citation);
          }
        }
      }
    });

    await modal.present();
  }

  async openCitationModal(index:number): Promise<void> {
    this.elmIndex = index;
    const modal = await this.modalCtrl.create({
      component: ModalcitationPage,
      cssClass: 'modalstyle',
      componentProps: {
        'citationId': this.citations[this.elmIndex]["citation"]["_id"],
        'user': this.user
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
      }
    });

    await modal.present();
  }

  deleteCitation(e:string): void {
    this.loader.present();
    this.apiService.deleteDeleteCitation(e).subscribe({
      next: (data:IData)=>{
        if (data["status"] === 1) {
          this.citations = this.citations.filter((item:ICitation) => item.citation._id !== e);
        }
        this.loader.dismiss();
      },
      error:(err)=>{
        this.loader.dismiss();
      }
    });
  }
}
