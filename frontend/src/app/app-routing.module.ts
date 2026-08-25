import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },

  {
    path: 'gateways',
    loadChildren: () =>
      import('./pages/gateways/gateways.module').then(
        (m) => m.GatewaysPageModule,
      ),
    canActivate: [AuthGuard],
  },

  { path: '', redirectTo: 'gateways', pathMatch: 'full' },
  {
    path: 'connectors',
    loadChildren: () => import('./pages/connectors/connectors.module').then((m) => m.ConnectorsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'machines',
    loadChildren: () =>
      import('./pages/machines/machines.module').then(
        (m) => m.MachinesPageModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'alerts',
    loadChildren: () => import('./pages/alerts/alerts.module').then((m) => m.AlertsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'alert-rules',
    loadChildren: () => import('./pages/alert-rules/alert-rules.module').then((m) => m.AlertRulesPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
