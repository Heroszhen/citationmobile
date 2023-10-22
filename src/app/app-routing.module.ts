import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TestGuard } from './guards/test.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'test/cloud',
    loadChildren: () => import('./pages/test/cloud/cloud.module').then( m => m.CloudPageModule),
    canActivate:[TestGuard]
  },  {
    path: 'cloud',
    loadChildren: () => import('./pages/cloud/cloud.module').then( m => m.CloudPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
