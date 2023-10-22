import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StoreService } from './services/store.service';
import { MenuController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { ILogin } from './interfaces/general';

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

  constructor(
    private readonly platform: Platform,
    private storeService: StoreService,
    private readonly menuController: MenuController,
    private readonly loadingCtrl: LoadingController,
    private readonly apiService: ApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.storeService.checkConnection();
    this.storeService.isConnected$.subscribe((data:Array<boolean|null>) => {
      this.isConnected = data[0];
    });

    this.loader = await this.loadingCtrl.create({
      spinner: "circles"
    });
    this.storeService.toLoad$.subscribe((data:Array<boolean>) => {
      if (data[0])this.loader.present();
      else this.loader.dismiss();
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
}
