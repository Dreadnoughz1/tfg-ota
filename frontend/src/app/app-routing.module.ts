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

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'gateways',
    loadChildren: () =>
      import('./pages/gateways/gateways.module').then(
        (m) => m.GatewaysPageModule,
      ),
  },
  {
    path: 'machines',
    loadChildren: () =>
      import('./pages/machines/machines.module').then(
        (m) => m.MachinesPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
