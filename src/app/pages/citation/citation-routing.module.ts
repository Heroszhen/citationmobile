import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitationPage } from './citation.page';

const routes: Routes = [
  {
    path: '',
    component: CitationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitationPageRoutingModule {}
