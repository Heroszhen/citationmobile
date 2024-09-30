import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ScannerQrcodeComponent } from '../components/scanner-qrcode/scanner-qrcode.component';
import { StoreService } from '../services/store.service';
import { Subscription } from 'rxjs';
import { IData, IUser } from '../interfaces/general';
import { Haptics } from '@capacitor/haptics';
import { User } from '../models/user';
import { readFile } from '../utils/generalUtil';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  subscribers: Subscription[] = [];
  user:IUser|null = null;
  sectionModal:number|null = null;
  section:number = 1;
  userM = new User();
  loader:any = null;
  @ViewChild('inputfile') inputFile: ElementRef<HTMLInputElement>;
  photoUrl:string = "";
  readFile = readFile;

  constructor(
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly apiService: ApiService,
    private readonly modalCtrl: ModalController,
    private readonly storeService: StoreService,
    private readonly loadingCtrl: LoadingController,
    private readonly toastrCtrl: ToastController,
  ) {}

  async ionViewWillEnter(): Promise<void> {
    this.section = 1;
    let subscriberUser:Subscription = this.storeService.user$.subscribe((data:Array<IUser|null>) => {
      this.user = data[0];
    });

    let subscriberServer:Subscription = this.storeService.isServerFree$.subscribe((data:Array<Boolean>) => {
      if (data[0]) {
        
      }
    });

    this.subscribers.push(subscriberUser, subscriberServer);

    this.loader = await this.loadingCtrl.create({
      spinner: "circles"
    });
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
          text: 'Modifier mon profile',
          handler: () => {
            this.photoUrl = "";
            if (this.user !== null) {
              this.userM = new User(this.user.lastname, this.user.firstname, this.user.email);
              this.section = 2;
            }
          }
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
      await Haptics.vibrate();
    }
  }

  ConfirmLoginQrcodeStatus(event:string): void {
    this.sectionModal = null;
    this.apiService.postConfirmLoginQrcodeStatus({key:(JSON.parse(event))['key']}).subscribe({});
  }

  async handleFilePhoto(target:EventTarget|null) {
    let file = (target as HTMLInputElement)?.files?.item(0);
    if (file) {
      this.userM.file = file;
      this.photoUrl = await readFile(file);
    }
  }

  async editProfile() {
    this.loader.present();
    let formData = new FormData();
    formData.append("lastname", this.userM.lastname);
    formData.append("firstname", this.userM.firstname);
    formData.append("email", this.userM.email);
    if (this.userM.file !== null)formData.append("file", this.userM.file);

    this.apiService.postEditProfile(formData).subscribe({
      next: async (data:IData) => {
        this.storeService.user$.next([data.data]);
        await this.loader.dismiss();
        (await this.toastrCtrl.create({
          message: 'Enregistré',
          duration: 1000,
          position: "top"
        })).present();
      },
      error: async (err) => {await this.loader.dismiss();}
    });
    
  }
}
