import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StoreService } from './services/store.service';
import { MenuController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { IData, ILogin } from './interfaces/general';
import { BeforeInstallPromptEvent } from './interfaces/general';
import { Router } from '@angular/router';

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

  constructor(
    private readonly platform: Platform,
    private storeService: StoreService,
    private readonly menuController: MenuController,
    private readonly loadingCtrl: LoadingController,
    private readonly apiService: ApiService,
    private readonly router: Router
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
    this.storeService.isConnected$.subscribe((data:Array<boolean|null>) => {
      this.isConnected = data[0];
    });

    this.storeService.toLoad$.subscribe((data:Array<boolean>) => {
      if (data[0])this.loader.present();
      else this.loader.dismiss();
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
    this.storeService.toLoad$.next([true]);
    this.apiService.postLogin(this.loginM).subscribe({
      next: (data:ILogin)=>{
        this.storeService.toLoad$.next([false]);
        if (data["status"] === 1) {
          localStorage.setItem("token", data["data"]);
        } 
      },
      error:(err)=>{
        this.storeService.toLoad$.next([false]);
      }
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
}
