import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RendercomPageRoutingModule } from './rendercom-routing.module';

import { RendercomPage } from './rendercom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RendercomPageRoutingModule
  ],
  declarations: [RendercomPage]
})
export class RendercomPageModule {}
