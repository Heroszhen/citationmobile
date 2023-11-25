import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalcameraPage } from './modalcamera.page';

const routes: Routes = [
  {
    path: '',
    component: ModalcameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalcameraPageRoutingModule {}
