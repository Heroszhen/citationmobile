import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitationComponent } from './citation/citation.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { PhonescreenComponent } from './phonescreen/phonescreen.component';

@NgModule({
  declarations: [
    CitationComponent,
    EditorComponent,
    PhonescreenComponent
  ],
  exports: [
    CitationComponent,
    EditorComponent,
    PhonescreenComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}