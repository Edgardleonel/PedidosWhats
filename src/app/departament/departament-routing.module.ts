import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartamentPage } from './departament.page';

const routes: Routes = [
  {
    path: '',
    component: DepartamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartamentPageRoutingModule {}
