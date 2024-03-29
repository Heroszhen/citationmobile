import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICitation, IUser } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  isConnected$ = new BehaviorSubject<Array<boolean|null>>([null]); 
  platform$ = new BehaviorSubject<Array<string>>(['']);
  user$ = new BehaviorSubject<Array<IUser|null>>([null]);
  isServerFree$ = new BehaviorSubject<Array<Boolean>>([false]);
  citations$ = new BehaviorSubject<Array<ICitation>>([]);
  isOnCalling$ = new BehaviorSubject<Array<Boolean>>([false]);

  constructor() { }

  checkConnection(): boolean {
    if (localStorage.getItem("token") === null || localStorage.getItem("token") === "") {
      this.isConnected$.next([false]);
      return false;
    } else {
      this.isConnected$.next([true]);
      return true;
    }
  }
}
