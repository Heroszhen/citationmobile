import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StoreService } from './services/store.service';
import { MenuController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { IData, ILogin } from './interfaces/general';
import { BeforeInstallPromptEvent } from './interfaces/general';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';
import { PhonescreenComponent } from './components/phonescreen/phonescreen.component';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

class Login {
  email:string = "";
  password:string = "";
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isProduction:boolean = environment.production;
  isConnected:boolean|null = false;
  modal:number|null = null;
  loginM:Login = new Login();
  loader:any = null;
  pf:string = "";
  deferredPrompt:BeforeInstallPromptEvent|null = null;
  currentRoute:string = "";

  constructor(
    private readonly platform: Platform,
    private storeService: StoreService,
    private readonly menuController: MenuController,
    private readonly loadingCtrl: LoadingController,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly socketService: SocketService,
    private readonly modalCtrl: ModalController
  ) {}

  async ngOnInit(): Promise<void> {
    this.loader = await this.loadingCtrl.create({
      spinner: "circles"
    });

    this.storeService.isServerFree$.next([false]);
    this.router.navigate(["/attendre-render-com-server"]);

    this.getPlatForm();
    if (this.pf === "web") {
      window.addEventListener(
        'beforeinstallprompt',
        this.onBeforeInstallPrompt.bind(this)
      );
    }  
    
    await this.checkServer();

    this.storeService.checkConnection();
    this.storeService.isConnected$.subscribe(async (data:Array<boolean|null>) => {
      this.isConnected = data[0];
      if (this.isConnected === true)await this.getLoginProfile();
    });
  }

  listenSocket():void {
    this.socketService.socket.on("server:call:sendPeerId", async(data:any) => {
      if (this.storeService.isOnCalling$.getValue()[0] === false) {
        if (data['user']['_id'] === undefined)data['user']["_id"] = data['user']['id'];
        const modal = await this.modalCtrl.create({
          component: PhonescreenComponent,
          cssClass: 'modalstyle',
          componentProps: {
            caller:data['user'],
            called:this.storeService.user$.getValue()[0],
            hisPeerId: data['peerId']
          }
        });
        await modal.present();
      }
    });
  }

  getPlatForm(): void {
    /** "ios" | "ipad" | "iphone" | "android" | "phablet" | "tablet" | "cordova" | "capacitor" | "electron" | "pwa" | "mobile" | "mobileweb" | "desktop" | "hybrid" */
    if (this.platform.is('android'))this.pf = "android";
    else if (this.platform.is('ios'))this.pf = "ios";
    else this.pf = "web";
    this.storeService.platform$.next([this.pf]);
  }

  async checkServer(): Promise<void> {
    return new Promise((resolve,reject) => {
      this.loader.present();
      this.apiService.getCheckServer().subscribe({
        next: (data:IData)=>{
          this.loader.dismiss();
          if (data["status"] === 1) {
            this.storeService.isServerFree$.next([true]);
          } 
          resolve();
        },
        error:(err)=>{
          this.loader.dismiss();
          resolve();
        }
      });
    });
  }

  switchModal(modal:number|null): void {
    this.menuController.close("mainmenu");
    if (modal === 1) {
      this.loginM = new Login();
    }
    this.modal = modal;
  }

  login(): void {
    this.apiService.postLogin(this.loginM).subscribe({
      next: (data:ILogin)=>{
        if (data["status"] === 1) {
          localStorage.setItem("token", data["data"]);
          this.storeService.isConnected$.next([true]);
          this.switchModal(null);
        } 
      },
      error:(err)=>{}
    });
  }

  onBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
    //console.log('🚀 onBeforeInstallPrompt');
    // Prevent the mini-info bar from appearing on mobile
    event?.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = event;
  }

  async installApp(): Promise<void> {
    //console.log('install', this.deferredPrompt);
    if (!this.deferredPrompt) {
      return;
    }
    this.deferredPrompt.prompt();
    const {outcome: outcome, platform:platform} = await this.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      this.deferredPrompt = null;
    }
  }

  deconnect():void {
    if (this.socketService.socket !== undefined)this.socketService.socket.emit("client:user:deconnect", {});
    localStorage.removeItem("token");
    this.storeService.user$.next([null]);
    this.storeService.isConnected$.next([false]);
    this.router.navigate(['/']);
  }

  async getLoginProfile(): Promise<void> {
    this.apiService.getGetLoginProfile().subscribe({
      next: (data:IData)=>{
        if (data["status"] === 1) {
         this.storeService.user$.next([data["data"]]);
         this.socketService.setSocket();
         this.listenSocket();
        } else {
          this.deconnect();
        }
      },
      error:(err)=>{
        this.deconnect();
      }
    });
  }
}
