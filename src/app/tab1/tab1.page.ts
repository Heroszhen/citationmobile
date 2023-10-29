import { Component } from '@angular/core';
import { ICitation, IDataCitations, IUser } from '../interfaces/general';
import { Subscription } from 'rxjs';
import { StoreService } from '../services/store.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  subscribers: Subscription[] = [];
  user:IUser|null = null;

  pageItem:number = 1;
  keywords:string = "";
  citations:ICitation[] = [];
  
  constructor(
    private readonly storeService:StoreService,
    private readonly apiService:ApiService
  ) {}

  ionViewWillEnter(): void {
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

  ionViewDidLeave(): void {
    for (let entry of this.subscribers) entry.unsubscribe();
  }

  async getCitations(): Promise<void> {
    this.apiService.getGetCitations(this.pageItem, this.keywords).subscribe({
      next: (data:IDataCitations)=>{
        if (data["status"] === 1) {
          if (data["data"].length !== 0) {
            this.pageItem++;
            this.citations = this.citations.concat(data["data"]);
          }
        }
      },
      error:(err)=>{
       
      }
    });
  }


  clearKeywords(): void {
    if (this.keywords !== "") {
      this.pageItem = 1;
      this.keywords = "";
      this.citations = [];
      this.getCitations();
    }
  }

}
