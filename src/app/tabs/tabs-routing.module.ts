import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:
    [
      {
        path: 'departamentos',
        loadChildren: () => import('../departament/departament.module').then( m => m.DepartamentPageModule)
      },
      {
        path: 'departamentos/:store',
        loadChildren: () => import('../store/store.module').then( m => m.StorePageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
