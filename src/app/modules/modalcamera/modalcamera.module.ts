import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcameraPageRoutingModule } from './modalcamera-routing.module';

import { ModalcameraPage } from './modalcamera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcameraPageRoutingModule
  ],
  declarations: [ModalcameraPage]
})
export class ModalcameraPageModule {}
