import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsPage } from './alerts.page';
@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AlertsPage }])],
  exports: [RouterModule],
})
export class AlertsPageRoutingModule {}
