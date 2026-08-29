import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertRulesPage } from './alert-rules.page';
@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AlertRulesPage }])],
  exports: [RouterModule],
})
export class AlertRulesPageRoutingModule {}
