import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GatewaysPageRoutingModule } from './gateways-routing.module';

import { GatewaysPage } from './gateways.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, GatewaysPageRoutingModule],
  declarations: [GatewaysPage],
})
export class GatewaysPageModule {}
