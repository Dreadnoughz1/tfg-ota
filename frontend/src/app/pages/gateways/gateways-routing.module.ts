import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GatewaysPage } from './gateways.page';

const routes: Routes = [
  {
    path: '',
    component: GatewaysPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GatewaysPageRoutingModule {}
