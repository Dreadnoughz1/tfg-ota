import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectorsPage } from './connectors.page';
const routes: Routes = [{ path: '', component: ConnectorsPage }];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ConnectorsPageRoutingModule {}
