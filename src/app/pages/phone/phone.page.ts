import { Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController, IonModal, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IDataPhoneUsers, IPhoneUser, IUser } from 'src/app/interfaces/general';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {
  user:IUser|null = null;
  subscribers: Subscription[] = [];

  allUsers: IPhoneUser[] = [];
  keywords:string = "";
  elmIndex:number = -1;
  loader:any = null;
  @ViewChild('phonemodal') phoneModal: IonModal;
  constructor(
    private readonly apiService: ApiService,
    private readonly storeService: StoreService,
    private readonly loadingCtrl: LoadingController,
    private readonly animationCtrl: AnimationController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(): Promise<void> {
    this.loader = await this.loadingCtrl.create({
      spinner: "circles"
    });

    let subscriberUser:Subscription = this.storeService.user$.subscribe((data:Array<IUser|null>) => {
      this.user = data[0];
    });
    this.subscribers.push(subscriberUser);

    this.getAllUsers();
  }

  ionViewDidLeave(): void {
    for (let entry of this.subscribers) entry.unsubscribe();
  }

  getAllUsers(): void {
    this.apiService.getGetPhoneUsers().subscribe({
      next: (data:IDataPhoneUsers)=>{
        if (data["status"] === 1) {
          this.allUsers = data['data'];
        }
      },
      error:(err)=>{}
    });
  }

  checkUserByKeywords(user:IPhoneUser): boolean {
    if (user.lastname.toLowerCase().includes(this.keywords.toLowerCase()))return true;
    if (user.firstname.toLowerCase().includes(this.keywords.toLowerCase()))return true;

    return false;
  }

  callUser(index:number): void {
    this.elmIndex = index;
    this.phoneModal.present();
    // this.loader.present();
    // this.storeService.isOnCalling$.next([true]);
    // this.socketService.socket.emit("client:user:call", {
    //   caller: this.user,
    //   called: this.allUsers[index]
    // });
    // this.storeService.isOnCalling$.next([false]);
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
  
}
