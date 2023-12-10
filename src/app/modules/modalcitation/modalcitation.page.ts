import { Component, Input, OnInit } from '@angular/core';
import { ICitation } from 'src/app/interfaces/general';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalcitation',
  templateUrl: './modalcitation.page.html',
  styleUrls: ['./modalcitation.page.scss'],
})
export class ModalcitationPage implements OnInit {
  @Input() citation:ICitation;

  constructor(
    private modalCtr: ModalController
  ) { }

  ngOnInit() {
    console.log(this.citation)
  }

  closeModal(): void {
    this.modalCtr.dismiss({
      'dismissed': true
    });
  }

}
