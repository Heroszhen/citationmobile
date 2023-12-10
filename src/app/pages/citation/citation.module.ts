import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitationPageRoutingModule } from './citation-routing.module';

import { CitationPage } from './citation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitationPageRoutingModule
  ],
  declarations: [CitationPage]
})
export class CitationPageModule {}
