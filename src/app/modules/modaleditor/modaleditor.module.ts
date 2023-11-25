import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModaleditorPageRoutingModule } from './modaleditor-routing.module';

import { ModaleditorPage } from './modaleditor.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModaleditorPageRoutingModule,
    QuillModule
  ],
  declarations: [ModaleditorPage]
})
export class ModaleditorPageModule {}
