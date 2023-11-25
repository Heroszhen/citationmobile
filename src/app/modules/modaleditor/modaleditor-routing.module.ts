import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModaleditorPage } from './modaleditor.page';

const routes: Routes = [
  {
    path: '',
    component: ModaleditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModaleditorPageRoutingModule {}
