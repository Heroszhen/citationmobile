import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloudPageRoutingModule } from './cloud-routing.module';

import { CloudPage } from './cloud.page';
import * as AWS from 'aws-sdk';
// import { SafePipe } from 'src/app/pipes/safe.pipe';
import { CommonPipeModule } from 'src/app/pipes/common-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudPageRoutingModule,
    CommonPipeModule
  ],
  declarations: [CloudPage]
})
export class CloudPageModule {}
