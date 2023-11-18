import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rendercom',
  templateUrl: './rendercom.page.html',
  styleUrls: ['./rendercom.page.scss'],
})
export class RendercomPage implements OnInit {
  subscribers: Subscription[] = [];
  constructor(
    private readonly storeService: StoreService,
    private readonly router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter(): void {
    let subscriberFreeServer:Subscription = this.storeService.isServerFree$.subscribe((data:Array<Boolean>) => {
      if (data[0]) {
        this.router.navigate(["/tab1"]);
      }
    });
    this.subscribers.push(subscriberFreeServer);
  }

  ionViewWillLeave(): void {
    for (let entry of this.subscribers) entry.unsubscribe();
  }

}
