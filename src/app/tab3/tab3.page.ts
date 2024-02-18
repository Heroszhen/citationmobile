import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ScannerQrcodeComponent } from '../components/scanner-qrcode/scanner-qrcode.component';
import { StoreService } from '../services/store.service';
import { Subscription } from 'rxjs';
import { IUser } from '../interfaces/general';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  subscribers: Subscription[] = [];
  user:IUser|null = null;
  
  sectionModal:number|null = null;

  constructor(
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly apiService: ApiService,
    private readonly modalCtrl: ModalController,
    private readonly storeService: StoreService
  ) {}

  ionViewWillEnter(): void {
    let subscriberUser:Subscription = this.storeService.user$.subscribe((data:Array<IUser|null>) => {
      this.user = data[0];
    });

    let subscriberServer:Subscription = this.storeService.isServerFree$.subscribe((data:Array<Boolean>) => {
      if (data[0]) {
        
      }
    });

    this.subscribers.push(subscriberUser, subscriberServer);
  }

  ionViewDidLeave(): void {
    for (let entry of this.subscribers) entry.unsubscribe();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Scanner login code barre',
          role: '',
          handler: () => {this.openScannerModal();}
        },
        {
          text: 'Action2',
          role: ''
        },
        {
          text: 'Action3',
          role: ''
        }
      ],
    });

    await actionSheet.present();
  }

  async openScannerModal(): Promise<void> {
    //this.sectionModal = 1;
    const modal = await this.modalCtrl.create({
      component: ScannerQrcodeComponent,
      componentProps: {
        modalCtrl: this.modalCtrl,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (data.content !== '') {
      this.apiService.postConfirmLoginQrcodeStatus({key:JSON.parse(data.content)['key']}).subscribe({});
    }
  }

  ConfirmLoginQrcodeStatus(event:any):void {
    this.sectionModal = null;console.log()
    this.apiService.postConfirmLoginQrcodeStatus({key:(JSON.parse(event))['key']}).subscribe({});
  }
}
