import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalcitationPageRoutingModule } from './modalcitation-routing.module';

import { ModalcitationPage } from './modalcitation.page';
import { SharedModule } from 'src/app/components/shared.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalcitationPageRoutingModule,
    SharedModule,
    QuillModule
  ],
  declarations: [ModalcitationPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalcitationPageModule {}
