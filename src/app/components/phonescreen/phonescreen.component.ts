import { Component, Input, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { IPhoneUser, IUser } from 'src/app/interfaces/general';

@Component({
  selector: 'app-phonescreen',
  templateUrl: './phonescreen.component.html',
  styleUrls: ['./phonescreen.component.scss'],
})
export class PhonescreenComponent  implements OnInit {
  @Input() modal:IonModal;
  @Input() caller:IUser|IPhoneUser|null = null;
  @Input() called:IUser|IPhoneUser|null = null;
  @Input() isCaller:boolean = false;
  myPeerId:string = '';
  hisPeerId:string = '';
  constructor() { }

  ngOnInit() {
    console.log(this.modal, this.isCaller, this.caller, this.called)
  }

}
