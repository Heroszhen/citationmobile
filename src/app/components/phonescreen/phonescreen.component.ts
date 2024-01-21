import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';
import { IPhoneUser, IUser } from 'src/app/interfaces/general';
import { SocketService } from 'src/app/services/socket.service';
import { StoreService } from 'src/app/services/store.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-phonescreen',
  templateUrl: './phonescreen.component.html',
  styleUrls: ['./phonescreen.component.scss'],
})
export class PhonescreenComponent  implements OnInit, AfterViewInit, OnDestroy {
  @Input() modal:IonModal;
  @Input() caller:IUser|IPhoneUser|null = null;
  @Input() called:IUser|IPhoneUser|null = null;
  @Input() isCaller:boolean = false;
  myPeerId:string = '';
  @Input() hisPeerId:string = '';
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('audiosong') audioSong: ElementRef<HTMLAudioElement>;
  communicating:boolean = false;
  constructor(
    private readonly storeService: StoreService,
    private readonly socketService: SocketService,
    private readonly toastController: ToastController,
  ) {
    this.storeService.isOnCalling$.next([true]);
  }

  ngOnInit() {
    this.socketService.socket.on("server:user:endCall", async (data:any) => {
      const toast = await this.toastController.create({
        message: `Fin de l'appel avec ${this.called?.lastname} ${this.called?.firstname}`,
        duration: 3000,
        position: 'top',
      });
      await toast.present();

      this.modal.dismiss();
    });

    this.socketService.socket.on("server:call:sendPeerId", async(data:any) => {
      this.hisPeerId = data['peerId'];
    });

    this.storeService.isOnCalling$.next([true]);
    this.myPeerId = uuidv4();
    if (this.isCaller) {
      this.socketService.socket.emit("client:user:call", {
        caller: this.caller,
        called: this.called,
        callerPeerId: this.myPeerId
      });
    }
  }

  ngAfterViewInit() {
    this.audioSong.nativeElement.play();
  }


  ngOnDestroy() {
    this.storeService.isOnCalling$.next([false]);
  }

  endCall(): void {
    this.storeService.isOnCalling$.next([false]);
    this.socketService.socket.emit("client:user:hangupCall", {
      user: this.isCaller ? this.caller : this.called,
      other: this.isCaller ? this.called : this.caller,
    });
    this.modal.dismiss();
  }

  acceptCall(): void {
    this.communicating = true;
    this.socketService.socket.emit("client:user:acceptCall", {
        caller: this.caller,
        called: this.called,
        peerId: this.myPeerId
    });
  }
}
