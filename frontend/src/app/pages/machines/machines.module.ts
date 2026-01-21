import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MachinesPageRoutingModule } from './machines-routing.module';

import { MachinesPage } from './machines.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MachinesPageRoutingModule],
  declarations: [MachinesPage],
})
export class MachinesPageModule {}
