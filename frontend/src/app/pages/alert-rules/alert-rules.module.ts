import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlertRulesPageRoutingModule } from './alert-rules-routing.module';
import { AlertRulesPage } from './alert-rules.page';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertRulesPageRoutingModule,
  ],
  declarations: [AlertRulesPage],
})
export class AlertRulesPageModule {}
