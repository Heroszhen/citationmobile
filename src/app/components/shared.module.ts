import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPipeModule } from '../pipes/common-pipe.module';

import { CitationComponent } from './citation/citation.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { PhonescreenComponent } from './phonescreen/phonescreen.component';
import { ScannerQrcodeComponent } from './scanner-qrcode/scanner-qrcode.component';

@NgModule({
  declarations: [
    CitationComponent,
    EditorComponent,
    PhonescreenComponent,
    ScannerQrcodeComponent
  ],
  exports: [
    CitationComponent,
    EditorComponent,
    PhonescreenComponent,
    ScannerQrcodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonPipeModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}