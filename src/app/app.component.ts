import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StoreService } from './services/store.service';
import { MenuController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { IData, ILogin } from './interfaces/general';
import { BeforeInstallPromptEvent } from './interfaces/general';
import { NavigationEnd, Router } from '@angular/router';
import { SocketService } from './services/socket.service';
import { PhonescreenComponent } from './components/phonescreen/phonescreen.component';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs';
import { wait } from './utils/generalUtil';

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
  modalSection:number = 1;
  loginM:Login = new Login();
  loginQrcode:string = "";
  loader:any = null;
  pf:string = "";
  deferredPrompt:BeforeInstallPromptEvent|null = null;
  currentRoute:string = "";
  timer:number|null = null;
  showIonTabs:boolean = true;

  constructor(
    private readonly platform: Platform,
    private storeService: StoreService,
    private readonly menuController: MenuController,
    private readonly loadingCtrl: LoadingController,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly socketService: SocketService,
    private readonly modalCtrl: ModalController,
    private readonly swUpdate: SwUpdate,
    private readonly toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    this.routerListener();

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
      this.updateApplication();
    }  
    
    //await this.checkServer();

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
    let envs:string = this.platform.platforms().join('-');
    if (envs.includes('hybrid')) {
      if (envs.includes('android'))this.pf = "android";
      if (envs.includes('ios'))this.pf = "ios";
    } else {
      this.pf = "web";
    }
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
      this.modalSection = 1;
    }
    if (modal === null) {
      if (this.modal === 1) {
        this.clearTimer();
      }
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

  getLoginQrcode():void {
    this.modalSection = 2;
    this.loginQrcode = "";
    this.apiService.getLoginQrcode().subscribe({
      next: (data:ILogin)=>{
        if (data["status"] === 1) {
          this.loginQrcode = data["data"];
          this.requestLoginQrcodeStatus();
        } 
      },
      error:(err)=>{}
    })
  }

  requestLoginQrcodeStatus() {
    this.timer = window.setInterval(() => {
      this.apiService.postGetLoginQrcodeStatus({qrcode:this.loginQrcode}).subscribe({
        next: (data:IData)=>{
          if (data["status"] === 1) {
            localStorage.setItem("token", data["data"]);
            this.storeService.isConnected$.next([true]);
            this.switchModal(null);
          }
        },
        error:(err)=>{}
      });
    }, 5000);
  }

  clearTimer() {
    clearInterval(this.timer as number);
    this.timer = null;
  }

  onBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
    //('🚀 onBeforeInstallPrompt');
    // Prevent the mini-info bar from appearing on mobile
    event?.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = event;
  }

  async installApp(): Promise<void> {
    //('install', this.deferredPrompt);
    if (!this.deferredPrompt) {
      return;
    }
    this.deferredPrompt.prompt();
    const {outcome: outcome, platform:platform} = await this.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      this.deferredPrompt = null;
    }
  }

  async updateApplication(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(async (evt) => {
          await wait(0.5);
          const toast = await this.toastController.create({
            message: "Une nouvelle version détectée, l'application va être redémarrée pour une mise à jour.",
            duration: 2000,
            position: 'middle',
          });
          await toast.present();
          
          document.location.reload();
        });
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

  routerListener(): void {
    this.router.events.pipe(
      filter((event:any): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url))
      .subscribe({
        next: (data:string)=>{
          if (data === '/music')this.showIonTabs = false;
          else this.showIonTabs = true;
        },
        error:(err:any) =>{}
    });
  }
}
