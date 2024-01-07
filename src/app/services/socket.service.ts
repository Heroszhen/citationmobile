import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';
import { IUser } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket:Socket;
  socketId: string = '';

  constructor(
    private readonly storeService: StoreService
  ) { }

  setSocket() {
    this.socket = io(environment.baseUrl);
    this.socket.on('connect', () => {
      this.socketId = this.socket.id;
      let user:IUser|null = this.storeService.user$.getValue()[0];
      this.socket.emit("client:user:setUserInfo", {
        id: user?._id,
        firstname: user?.firstname,
        lastname: user?.lastname
      });
    });
  }
}
