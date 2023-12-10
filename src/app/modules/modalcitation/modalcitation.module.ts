import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcitationPageRoutingModule } from './modalcitation-routing.module';

import { ModalcitationPage } from './modalcitation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcitationPageRoutingModule
  ],
  declarations: [ModalcitationPage]
})
export class ModalcitationPageModule {}
