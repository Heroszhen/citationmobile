import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICitation, IUser } from 'src/app/interfaces/general';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss'],
})
export class CitationComponent  implements OnInit, OnDestroy {
  @Input() citation: ICitation|null = null;
  subscribers: Subscription[] = [];
  user:IUser|null = null;
  @Output() sendDeletion = new EventEmitter<string>();
  
  constructor(
    private readonly storeService:StoreService,
    private readonly apiService:ApiService
  ) {}

  ngOnInit() {
    let subscriberUser:Subscription = this.storeService.user$.subscribe((data:Array<IUser|null>) => {
      this.user = data[0];
    });

    this.subscribers.push(subscriberUser);
  }

  ngOnDestroy(): void {
    for (let entry of this.subscribers) entry.unsubscribe();
  }

  deleteCitation(): void {
    this.sendDeletion.emit(this.citation?.citation['_id']);
  }
}
