import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConnectorsPageRoutingModule } from './connectors-routing.module';
import { ConnectorsPage } from './connectors.page';
@NgModule({ imports: [CommonModule, FormsModule, IonicModule, ConnectorsPageRoutingModule], declarations: [ConnectorsPage] })
export class ConnectorsPageModule {}
