import { NgModule } from '@angular/core'; import { CommonModule } from '@angular/common'; import { IonicModule } from '@ionic/angular'; import { AlertsPageRoutingModule } from './alerts-routing.module'; import { AlertsPage } from './alerts.page';
@NgModule({imports:[CommonModule,IonicModule,AlertsPageRoutingModule],declarations:[AlertsPage]}) export class AlertsPageModule {}
