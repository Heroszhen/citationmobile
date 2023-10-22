import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  isConnected$ = new BehaviorSubject<Array<boolean|null>>([null]);
  toLoad$ = new BehaviorSubject<Array<boolean>>([false]); 

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
